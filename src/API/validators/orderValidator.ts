import {
  fulfillStandingOrderSchema,
  newMarketOrderSchema,
  newStandingOrderSchema,
  updateStandingOrderSchema
} from './schemas/orderSchemas'

export const validateOrder = {
  newStandingOrder: (req: unknown) => newStandingOrderSchema.validate(req),
  fulfillStandingOrder: (req: unknown) =>
    fulfillStandingOrderSchema.validate(req),
  updateStandingOrder: (req: unknown) =>
    updateStandingOrderSchema.validate(req),
  newMarketOrder: (req: unknown) => newMarketOrderSchema.validate(req)
}
