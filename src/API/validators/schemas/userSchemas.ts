import Joi from 'joi'

type UserCredentialsRequest = {
  username: string
  password: string
}

export const newUserSchema = Joi.object<UserCredentialsRequest>({
  username: Joi.string(),
  password: Joi.string()
})

export const loginSchema = Joi.object<UserCredentialsRequest>({
  username: Joi.string(),
  password: Joi.string()
})
