import { ValidationResult } from 'joi'
import { Denomination } from '../../db/requests/orders'
import { newMarketOrder, newStandingOrder } from './schemas/orderSchemas'

export type MarketOrderRequest = {
  username: string
  buyDenomination: Denomination
  sellDenomination: Denomination
  amount: number
}
export type StandingOrderRequest = MarketOrderRequest & {
  limitPrice: number
}

export const validateOrder = {
  newStandingOrder: (req: unknown) =>
    newStandingOrder.validate(req) as ValidationResult<StandingOrderRequest>,
  updateStandingOrder: (req: unknown) =>
    newStandingOrder.validate(req) as ValidationResult<StandingOrderRequest>,
  newMarketOrder: (req: unknown) =>
    newMarketOrder.validate(req) as ValidationResult<MarketOrderRequest>
}
