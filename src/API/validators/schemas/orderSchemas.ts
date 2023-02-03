import Joi from 'joi'

const baseOrderFieldsSchema = {
  username: Joi.string(),
  sellDenomination: Joi.string(),
  buyDenomination: Joi.string(),
  amount: Joi.number()
}

export const newStandingOrderSchema = Joi.object({
  ...baseOrderFieldsSchema,
  limitPrice: Joi.number()
})

export const fulfillStandingOrderSchema = Joi.object({
  username: Joi.string(),
  amount: Joi.number()
})

export const newMarketOrderSchema = Joi.object(baseOrderFieldsSchema)
