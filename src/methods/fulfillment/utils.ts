import { OrderFulfillment } from './types'
import { Knex } from 'knex'
import { fulfillOrderDB } from '../../db/requests/standingOrders'
export const getAveragePrice = (orders: OrderFulfillment[]) => {
  const bought = orders.reduce(
    (bought, { amount, order }) => bought + amount / order.limit_price,
    0
  )
  const spent = orders.reduce((spent, { amount }) => spent + amount, 0)
  return spent / bought
}

export const standingOrdersToPromises = (
  buyerUsername: string,
  trx: Knex.Transaction,
  orders?: OrderFulfillment[]
) =>
  orders
    ? orders.map(({ order, amount }) =>
        fulfillOrderDB({ order, buyerUsername, amount }, trx)
      )
    : []
