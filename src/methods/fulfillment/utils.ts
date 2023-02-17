import { DB } from '@db/database'
import { Knex } from 'knex'
import { container } from 'tsyringe'

import { OrderFulfillment } from './types'

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
        container
          .resolve(DB)
          .standingOrder.fulfillOrder({ order, buyerUsername, amount }, trx)
      )
    : []
