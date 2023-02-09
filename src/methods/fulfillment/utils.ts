import { OrderFulfillment } from './types'

export const getAveragePrice = (orders: OrderFulfillment[]) => {
  const bought = orders.reduce(
    (bought, { amount, order }) => bought + amount / order.limit_price,
    0
  )
  const spent = orders.reduce((spent, { amount }) => spent + amount, 0)
  return spent / bought
}
