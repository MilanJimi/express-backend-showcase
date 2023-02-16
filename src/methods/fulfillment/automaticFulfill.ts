import { dbClient } from '../../db/client'
import { db } from '../../db/database'
import { log } from '../../logging/logger'
import { findAutofulfillStandingOrders } from './findStandingOrders'
import { FindStandingOrdersParams, OrderFulfillment } from './types'
import { getAveragePrice, standingOrdersToPromises } from './utils'

const logAutomaticFulfillment = (id: string, orders: OrderFulfillment[]) =>
  orders.length > 0
    ? log(
        'info',
        `Automatic fulfillment for order ${id} with orders %j`,
        orders.map((it) => it.order.id)
      )
    : log('info', `No orders found for automatic fulfillment of ${id}`)

export const automaticFulfillOrder = async (
  orderParams: FindStandingOrdersParams
) => {
  const { buyDenomination, sellDenomination, amount, username } = orderParams
  const { orders, outstandingAmount } = await findAutofulfillStandingOrders(
    orderParams
  )
  const averagePrice = getAveragePrice(orders)

  const order = await dbClient.transaction(async (trx) => {
    const fulfillOrdersFunctions = standingOrdersToPromises(
      username,
      trx,
      orders
    )
    const newOrderPromise =
      orderParams.type === 'STANDING'
        ? db.createNewStandingOrder(trx, {
            ...orderParams,
            username,
            outstandingAmount
          })
        : db.insertMarketOrder(
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

  logAutomaticFulfillment(order.id, orders)
  return {
    order,
    automaticFulfillment: {
      quantity: orderParams.amount - outstandingAmount,
      averagePrice
    }
  }
}
