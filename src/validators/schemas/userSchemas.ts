import Joi from 'joi'

export const newUserSchema = Joi.object({
  username: Joi.string(),
  password: Joi.string()
})
