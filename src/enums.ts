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

export enum ErrorCode {
  orderNotFound = 'ERROR_ORDER_NOT_FOUND',
  orderFulfilled = 'ERROR_ORDER_ALREADY_FULFILLED',
  orderCancelled = 'ERROR_ORDER_CANCELLED',
  orderSmallerThanAmount = 'ERROR_ORDER_SMALLER_THAN_AMOUNT',
  insufficientBalance = 'ERROR_INSUFFICIENT_BALANCE',
  unknown = 'ERROR_UNKNOWN'
}
