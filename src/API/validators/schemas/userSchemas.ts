import Joi from 'joi'

export const newUserSchema = Joi.object({
  username: Joi.string(),
  password: Joi.string()
})

export const loginSchema = Joi.object({
  username: Joi.string(),
  password: Joi.string()
})
