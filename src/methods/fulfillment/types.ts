import { Denomination, StandingOrder } from '../../db/requests/types'

export type OrderFulfillment = { order: StandingOrder; amount: number }

type SharedNewOrderParams = {
  username: string
  buyDenomination: Denomination
  sellDenomination: Denomination
  amount: number
}
export enum OrderType {
  standing = 'STANDING',
  market = 'MARKET'
}

export type FindStandingOrdersParams = SharedNewOrderParams &
  (
    | {
        limitPrice: number
        type: OrderType.standing
      }
    | { type: OrderType.market }
  )

export type CheapStandingOrders = {
  orders: OrderFulfillment[]
  outstandingAmount: number
}
