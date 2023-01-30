import Joi from 'joi'

export const topupBalanceSchema = Joi.object({
  username: Joi.string(),
  denomination: Joi.string().length(3),
  amount: Joi.number().greater(0)
})

export const withdrawBalanceSchema = Joi.object({
  username: Joi.string(),
  denomination: Joi.string().length(3),
  amount: Joi.number().greater(0)
})
