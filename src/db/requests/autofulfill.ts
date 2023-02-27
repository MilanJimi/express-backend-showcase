import { getAveragePrice } from '@api/routes/standingOrders/service/helpers'
import { dbClient } from '@db/client'
import { Knex } from 'knex'
import { NewOrderParams, OrderFulfillment } from 'src/methods/fulfillment/types'
import { injectable } from 'tsyringe'

import { MarketOrderController } from './marketOrders'
import { StandingOrderController } from './standingOrders'

@injectable()
export class AutoFulfillController {
  constructor(
    private marketController: MarketOrderController,
    private standingController: StandingOrderController
  ) {}

  standingOrdersToPromises = (
    buyerUsername: string,
    trx: Knex.Transaction,
    orders?: OrderFulfillment[]
  ) =>
    orders
      ? orders.map(({ order, amount }) =>
          this.standingController.fulfillOrder(
            { order, buyerUsername, amount },
            trx
          )
        )
      : []

  fulfill = async (
    orderParams: NewOrderParams,
    orders: OrderFulfillment[],
    outstandingAmount: number
  ) => {
    const { buyDenomination, sellDenomination, amount, username } = orderParams
    const averagePrice = getAveragePrice(orders)

    return await dbClient.transaction(async (trx) => {
      const fulfillOrdersFunctions = this.standingOrdersToPromises(
        username,
        trx,
        orders
      )
      const newOrderPromise =
        orderParams.type === 'STANDING'
          ? this.standingController.createNewStandingOrder(trx, {
              ...orderParams,
              username,
              outstandingAmount
            })
          : this.marketController.insertMarketOrder(
              trx,
              {
                username,
                buyDenomination,
                sellDenomination,
                amount: amount - outstandingAmount
              },
              averagePrice
            )

      const [order] = await Promise.all([
        newOrderPromise,
        ...fulfillOrdersFunctions
      ])

      return order
    })
  }
}
