import { ValidationResult } from 'joi'
import {
  fulfillStandingOrderSchema,
  newMarketOrderSchema,
  newStandingOrderSchema
} from './schemas/orderSchemas'
import {
  StandingOrderRequest,
  FulfillStandingOrderRequest,
  MarketOrderRequest
} from './types'

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
