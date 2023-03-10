import { Denomination, OrderStatus } from '../../enums'

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

export type UpdateStandingOrderRequest = { username: string } & Partial<{
  newAmount: number
  status: OrderStatus
  newLimitPrice: number
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
