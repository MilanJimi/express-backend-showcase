import { Knex } from 'knex'

import { StandingOrderRequest } from '../../API/validators/types'
import { dateOrderParams } from '../../db/common/sorting'
import { db } from '../../db/dbConnector'
import { putMoneyOnHoldDB } from '../../db/requests/balance'
import {
  fulfillOrderDB,
  getStandingOrdersDB,
  insertStandingOrderDB,
  standingOrderSorting
} from '../../db/requests/orders'
import { OrderStatus } from '../../db/requests/types'
import { log } from '../../logging/logger'
import { CheapStandingOrders, OrderFulfillment } from './types'
import { getAveragePrice } from './utils'

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
    status: OrderStatus.live,
    minPrice: 1 / limitPrice,
    orderBy: [standingOrderSorting.priceDesc, dateOrderParams.dateAsc]
  })
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
  return { orders: ordersToFulfill, outstandingAmount: outstandingBuyerAmount }
}
const getStandingOrderPromises = (
  buyerUsername: string,
  trx: Knex.Transaction,
  orders?: OrderFulfillment[]
) =>
  orders
    ? orders.map(({ order, amount }) =>
        fulfillOrderDB({ order, buyerUsername, amount }, trx)
      )
    : []

const logAutomaticFulfillment = (id: string, orders: OrderFulfillment[]) =>
  orders.length > 0
    ? log(
        'info',
        `Automatic fulfillment for order ${id} with orders %j`,
        orders.map((it) => it.order.id)
      )
    : log('info', `No orders found for automatic fulfillment of ${id}`)

export const newStandingOrder = async (params: StandingOrderRequest) => {
  const { orders, outstandingAmount } = await findCheaperStandingOrders(params)

  const response = await db.transaction(async (trx) => {
    const fulfillOrdersFunctions = getStandingOrderPromises(
      params.username,
      trx,
      orders
    )
    const [response] = await Promise.all([
      createNewStandingOrder(trx, {
        ...params,
        outstandingAmount: outstandingAmount
      }),
      ...fulfillOrdersFunctions
    ])

    return response
  })

  logAutomaticFulfillment(response.id, orders)
  return {
    order: response,
    automaticFulfillment: {
      quantity: params.amount - outstandingAmount,
      averagePrice: getAveragePrice(orders)
    }
  }
}
