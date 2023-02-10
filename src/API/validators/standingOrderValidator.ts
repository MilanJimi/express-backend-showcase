import {
  fulfillStandingOrderSchema,
  newStandingOrderSchema,
  updateStandingOrderSchema
} from './schemas/standingOrderSchemas'

export const validateStandingOrder = {
  new: (req: unknown) => newStandingOrderSchema.validate(req),
  fulfill: (req: unknown) => fulfillStandingOrderSchema.validate(req),
  update: (req: unknown) => updateStandingOrderSchema.validate(req)
}
