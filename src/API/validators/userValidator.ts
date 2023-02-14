import { loginSchema, newUserSchema } from './schemas/userSchemas'

export const validateUser = {
  new: newUserSchema,
  login: loginSchema
}
