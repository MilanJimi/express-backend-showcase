import { StandingOrder } from '../../db/requests/types'

export type OrderFulfillment = { order: StandingOrder; amount: number }

export type CheapStandingOrders = {
  orders: OrderFulfillment[]
  outstandingAmount: number
}
