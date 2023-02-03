export enum OrderStatus {
  live = 'LIVE',
  fulfilled = 'FULFILLED',
  cancelled = 'CANCELLED'
}

export enum Denomination {
  AUD = 'AUD',
  EUR = 'EUR',
  USD = 'USD'
}
export type StandingOrder = {
  id: string
  username: string
  status: OrderStatus
  sell_denomination: Denomination
  buy_denomination: Denomination
  limit_price: number
  quantity_original: number
  quantity_outstanding: number
}
export type GetOrderFilter = Partial<{
  id: string
  username: string
  status: OrderStatus
  buyDenomination: Denomination
  sellDenomination: Denomination
}>

export type Balance = {
  id: string
  username: string
  denomination: Denomination
  balance: number
  available_balance: number
}
export type GetBalanceFilters = {
  username: string
  denomination: Denomination
}
export type UpsertBalanceParams = {
  username: string
  denomination: string
  amount: number
  skipAvailableBalanceUpdate?: boolean
}
export type PutMoneyOnHoldParams = {
  username: string
  denomination: Denomination
  amount: number
}
