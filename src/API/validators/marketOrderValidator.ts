import { newMarketOrderSchema } from './schemas/marketOrderSchemas'

export const validateMarketOrder = {
  new: (req: unknown) => newMarketOrderSchema.validate(req)
}
