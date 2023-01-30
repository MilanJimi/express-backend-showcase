import Joi from 'joi'

import { topupBalanceSchema, withdrawBalanceSchema } from './schemas/balanceSchemas'

export type BalanceRequest = {
  username: string
  denomination: string
  amount: number
}

export const validateBalance = {
  topup: (req: unknown) =>
    topupBalanceSchema.validate(req) as Joi.ValidationResult<BalanceRequest>,
  withdraw: (req: unknown) =>
    withdrawBalanceSchema.validate(req) as Joi.ValidationResult<BalanceRequest>
}
