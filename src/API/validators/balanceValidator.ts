import { ValidationResult } from 'joi'

import {
  topupBalanceSchema,
  withdrawBalanceSchema
} from './schemas/balanceSchemas'
import { BalanceRequest } from './types'

export const validateBalance = {
  topup: (req: unknown) =>
    topupBalanceSchema.validate(req) as ValidationResult<BalanceRequest>,
  withdraw: (req: unknown) =>
    withdrawBalanceSchema.validate(req) as ValidationResult<BalanceRequest>
}
export { BalanceRequest }
