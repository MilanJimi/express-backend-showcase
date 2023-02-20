import { StandingOrder } from '@db/requests/types'
import { OrderStatus } from 'src/enums'

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
