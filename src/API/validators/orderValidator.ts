import { ValidationResult } from 'joi'
import { Denomination } from '../../db/requests/orders'
import {
  fulfillStandingOrderSchema,
  newMarketOrderSchema,
  newStandingOrderSchema
} from './schemas/orderSchemas'

export type MarketOrderRequest = {
  username: string
  buyDenomination: Denomination
  sellDenomination: Denomination
  amount: number
}
export type StandingOrderRequest = MarketOrderRequest & {
  limitPrice: number
}

export type FulfillStandingOrderRequest = {
  username: string
  amount: number
}

export const validateOrder = {
  newStandingOrder: (req: unknown) =>
    newStandingOrderSchema.validate(
      req
    ) as ValidationResult<StandingOrderRequest>,
  fulfillStandingOrder: (req: unknown) =>
    fulfillStandingOrderSchema.validate(
      req
    ) as ValidationResult<FulfillStandingOrderRequest>,
  updateStandingOrder: (req: unknown) =>
    newStandingOrderSchema.validate(
      req
    ) as ValidationResult<StandingOrderRequest>,
  newMarketOrder: (req: unknown) =>
    newMarketOrderSchema.validate(req) as ValidationResult<MarketOrderRequest>
}
