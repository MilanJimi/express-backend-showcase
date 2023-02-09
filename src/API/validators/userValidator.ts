import { loginSchema, newUserSchema } from './schemas/userSchemas'

export const validateUser = {
  new: (req: unknown) => newUserSchema.validate(req),
  login: (req: unknown) => loginSchema.validate(req)
}
