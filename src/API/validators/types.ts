import { Denomination } from '../../db/requests/types'

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

export type FulfillStandingOrderRequest = {
  username: string
  amount: number
}

export type BalanceRequest = {
  username: string
  denomination: Denomination
  amount: number
}
