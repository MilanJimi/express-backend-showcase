import { Balance } from '@db/requests/types'
import Joi from 'joi'

import { Denomination } from '../../../enums'
import { BalanceRequest } from '../types'

export const changeBalanceSchema = Joi.object<BalanceRequest>({
  denomination: Joi.string().valid(Denomination),
  amount: Joi.number().greater(0)
})

export const balanceSchema = Joi.object<Balance>({
  id: Joi.string(),
  denomination: Joi.string().valid(Denomination),
  balance: Joi.number().greater(0),
  available_balance: Joi.number().greater(0)
})
