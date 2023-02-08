import { Knex } from 'knex'

import { StandingOrderRequest } from '../../API/validators/types'
import { db } from '../../db/dbConnector'
import { putMoneyOnHoldDB } from '../../db/requests/balance'
import {
  fulfillOrderDB,
  getStandingOrdersDB,
  insertStandingOrderDB,
  standingOrderSorting
} from '../../db/requests/orders'
import { StandingOrder } from '../../db/requests/types'
import { log } from '../../logging/logger'
import { CheapStandingOrders } from './types'

const createNewStandingOrder = (
  trx: Knex.Transaction,
  params: StandingOrderRequest
) =>
  trx.transaction(async (trx) => {
    await putMoneyOnHoldDB(trx, {
      username: params.username,
      amount: params.outstandingAmount ?? params.amount,
      denomination: params.sellDenomination
    })
    const response = await insertStandingOrderDB(trx, params)
    return response
  })

const findCheaperStandingOrders = async ({
  buyDenomination,
  sellDenomination,
  amount,
  limitPrice
}: StandingOrderRequest): Promise<CheapStandingOrders> => {
  // Get all reverse orders which are cheaper
  const cheaperOrders = await getStandingOrdersDB({
    buyDenomination: sellDenomination,
    sellDenomination: buyDenomination,
    minPrice: 1 / limitPrice,
    orderBy: standingOrderSorting.priceDesc
  })
  if (cheaperOrders.length === 0)
    return { orders: [], outstandingAmount: amount }

  // This is one of the places where let is a valid choice
  let outstandingBuyerAmount = amount
  const ordersToFulfill: { order: StandingOrder; amount: number }[] = []
  for (const order of cheaperOrders) {
    if (order.quantity_outstanding >= outstandingBuyerAmount) {
      ordersToFulfill.push({
        order,
        amount: outstandingBuyerAmount
      })
      outstandingBuyerAmount = 0
      break
    }
    outstandingBuyerAmount -= order.quantity_outstanding
    ordersToFulfill.push({
      order,
      amount: order.quantity_outstanding
    })
  }
  return { orders: ordersToFulfill, outstandingAmount: outstandingBuyerAmount }
}

export const newStandingOrder = async (params: StandingOrderRequest) => {
  const cheaperStandingOrders = await findCheaperStandingOrders(params)
  return db.transaction(async (trx) => {
    const fulfillOrdersFunctions = cheaperStandingOrders.orders
      ? cheaperStandingOrders.orders.map(({ order, amount }) =>
          fulfillOrderDB({ order, buyerUsername: params.username, amount }, trx)
        )
      : []
    const [response] = await Promise.all([
      createNewStandingOrder(trx, {
        ...params,
        outstandingAmount: cheaperStandingOrders.outstandingAmount
      }),
      ...fulfillOrdersFunctions
    ])
    cheaperStandingOrders.orders.length > 0
      ? log(
          'info',
          `Automatic fulfillment for order ${response.id} with orders %j`,
          cheaperStandingOrders.orders.map((it) => it.order.id)
        )
      : log(
          'info',
          `No orders found for automatic fulfillment of ${response.id}`
        )
    return response
  })
}
