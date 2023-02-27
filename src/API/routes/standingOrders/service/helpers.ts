import { StandingOrder } from '@db/requests/types'
import { OrderStatus } from 'src/enums'
import { log } from 'src/logging/logger'
import { OrderFulfillment } from 'src/methods/fulfillment/types'

type BalanceAdjustmentParams = {
  order: StandingOrder
  newStatus?: OrderStatus
  newAmount?: number
  newLimitPrice?: number
}
export const isCancelledAndNotReactivated = (
  currentStatus: OrderStatus,
  newStatus?: OrderStatus
) => newStatus !== OrderStatus.live && currentStatus === OrderStatus.cancelled

export const getBalanceAdjustment = ({
  order,
  newStatus,
  newAmount,
  newLimitPrice
}: BalanceAdjustmentParams) => {
  const currentHold =
    order.status === OrderStatus.cancelled
      ? 0
      : order.quantity_outstanding * order.limit_price
  const newHold =
    newStatus === OrderStatus.cancelled
      ? 0
      : (newAmount ?? order.quantity_outstanding) *
        (newLimitPrice ?? order.limit_price)
  return currentHold - newHold
}

export const logAutomaticFulfillment = (
  id: string,
  orders: OrderFulfillment[]
) =>
  orders.length > 0
    ? log(
        'info',
        `Automatic fulfillment for order ${id} with orders %j`,
        orders.map((it) => it.order.id)
      )
    : log('info', `No orders found for automatic fulfillment of ${id}`)

export const getAveragePrice = (orders: OrderFulfillment[]) => {
  const bought = orders.reduce(
    (bought, { amount, order }) => bought + amount / order.limit_price,
    0
  )
  const spent = orders.reduce((spent, { amount }) => spent + amount, 0)
  return spent / bought
}
