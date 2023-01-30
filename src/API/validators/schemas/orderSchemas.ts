import Joi from 'joi'

export const newOrder = Joi.object({
  username: Joi.string(),
  sellDenomination: Joi.string(),
  buyDenomination: Joi.string(),
  limitPrice: Joi.number(),
  quantity: Joi.number()
})
