import Joi from 'joi'

const baseOrderFields = {
  username: Joi.string(),
  sellDenomination: Joi.string(),
  buyDenomination: Joi.string(),
  amount: Joi.number()
}

export const newStandingOrder = Joi.object({
  ...baseOrderFields,
  limitPrice: Joi.number()
})

export const newMarketOrder = Joi.object(baseOrderFields)
