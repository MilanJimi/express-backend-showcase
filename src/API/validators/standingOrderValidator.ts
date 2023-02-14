import {
  fulfillStandingOrderSchema,
  newStandingOrderSchema,
  updateStandingOrderSchema
} from './schemas/standingOrderSchemas'

export const validateStandingOrder = {
  new: newStandingOrderSchema,
  fulfill: fulfillStandingOrderSchema,
  update: updateStandingOrderSchema
}
