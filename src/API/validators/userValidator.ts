import { ValidationResult } from 'joi'
import { loginSchema, newUserSchema } from './schemas/userSchemas'

type UserCredentialsRequest = {
  username: string
  password: string
}

export const validateUser = {
  new: (req: unknown) =>
    newUserSchema.validate(req) as ValidationResult<UserCredentialsRequest>,
  login: (req: unknown) =>
    loginSchema.validate(req) as ValidationResult<UserCredentialsRequest>
}
