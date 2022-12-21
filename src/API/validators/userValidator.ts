import Joi from 'joi'
import { loginSchema, newUserSchema } from './schemas/userSchemas'

type UserCredentials = {
  username: string
  password: string
}

export const validateUser = {
  new: (req: unknown) =>
    newUserSchema.validate(req) as Joi.ValidationResult<UserCredentials>,
  login: (req: unknown) =>
    loginSchema.validate(req) as Joi.ValidationResult<UserCredentials>
}
