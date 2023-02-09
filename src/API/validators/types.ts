import { Denomination, OrderStatus } from '../../db/requests/types'

export type MarketOrderRequest = {
  username: string
  buyDenomination: Denomination
  sellDenomination: Denomination
  amount: number
}
export type StandingOrderRequest = MarketOrderRequest & {
  limitPrice: number
  outstandingAmount?: number
}

export type UpdateStandingOrderRequest = Partial<{
  adjustAmount: number
  status: OrderStatus
}>

export type FulfillStandingOrderRequest = {
  username: string
  amount: number
}

export type BalanceRequest = {
  username: string
  denomination: Denomination
  amount: number
}
