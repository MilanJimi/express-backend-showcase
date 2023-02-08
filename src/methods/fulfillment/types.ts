import { StandingOrder } from '../../db/requests/types'

export type CheapStandingOrders = {
  orders: { order: StandingOrder; amount: number }[]
  outstandingAmount: number
}
