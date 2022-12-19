import { newUserSchema } from './schemas/userSchemas'

export const validateUser = {
  new: (req: unknown) => newUserSchema.validate(req)
}
