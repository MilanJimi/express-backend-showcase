import { ValidationResult } from 'joi'
import { Denomination } from '../../db/requests/orders'

import {
  topupBalanceSchema,
  withdrawBalanceSchema
} from './schemas/balanceSchemas'

export type BalanceRequest = {
  username: string
  denomination: Denomination
  amount: number
}

export const validateBalance = {
  topup: (req: unknown) =>
    topupBalanceSchema.validate(req) as ValidationResult<BalanceRequest>,
  withdraw: (req: unknown) =>
    withdrawBalanceSchema.validate(req) as ValidationResult<BalanceRequest>
}
