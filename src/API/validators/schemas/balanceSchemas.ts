import Joi from 'joi'
import { BalanceRequest } from '../types'

export const changeBalanceSchema = Joi.object<BalanceRequest>({
  username: Joi.string(),
  denomination: Joi.string().length(3),
  amount: Joi.number().greater(0)
})
