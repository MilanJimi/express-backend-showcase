import { dateOrderParams } from '@db/common/sorting'
import { DB } from '@db/database'
import { standingOrderSorting } from '@db/requests/standingOrders'
import { OrderStatus } from 'src/enums'
import {
  CheapStandingOrders,
  NewOrderParams,
  OrderFulfillment
} from 'src/methods/fulfillment/types'

import { getAveragePrice, logAutomaticFulfillment } from './helpers'
import { StandingOrderService } from './standingOrderService'

export class AutomaticFulfillmentService {
  constructor(private orderService: StandingOrderService, private db: DB) {}

  getCheaperOrders = ({
    buyDenomination,
    sellDenomination,
    limitPrice
  }: NewOrderParams) =>
    this.orderService.getMultiple({
      buyDenomination: sellDenomination,
      sellDenomination: buyDenomination,
      status: OrderStatus.live,
      minPrice: limitPrice ? 1 / limitPrice : undefined,
      orderBy: [standingOrderSorting.priceDesc, dateOrderParams.dateAsc]
    })

  findAutofulfillStandingOrders = async (
    params: NewOrderParams
  ): Promise<CheapStandingOrders> => {
    const { amount } = params

    // Get all reverse orders which are cheaper
    const cheaperOrders = await this.getCheaperOrders(params)
    if (cheaperOrders.length === 0)
      return { orders: [], outstandingAmount: amount }

    // This is one of the places where let is a valid choice
    let outstandingBuyerAmount = amount
    const ordersToFulfill: OrderFulfillment[] = []
    for (const order of cheaperOrders) {
      // Amount in new buyer's order runs out
      if (order.quantity_outstanding >= outstandingBuyerAmount) {
        ordersToFulfill.push({
          order,
          amount: outstandingBuyerAmount
        })
        outstandingBuyerAmount = 0
        break
      }

      // There is still some outstanding amount
      outstandingBuyerAmount -= order.quantity_outstanding
      ordersToFulfill.push({
        order,
        amount: order.quantity_outstanding
      })
    }
    return {
      orders: ordersToFulfill,
      outstandingAmount: outstandingBuyerAmount
    }
  }

  automaticFulfillOrder = async (orderParams: NewOrderParams) => {
    const { orders, outstandingAmount } =
      await this.findAutofulfillStandingOrders(orderParams)

    const order = await this.db.autofulfill.fulfill(
      orderParams,
      orders,
      outstandingAmount
    )
    logAutomaticFulfillment(order.id, orders)
    return {
      order,
      automaticFulfillment: {
        quantity: orderParams.amount - outstandingAmount,
        averagePrice: getAveragePrice(orders)
      }
    }
  }
}
