import { changeBalanceSchema } from './schemas/balanceSchemas'
import { BalanceRequest } from './types'

export const validateBalance = {
  topup: (req: unknown) => changeBalanceSchema.validate(req),
  withdraw: (req: unknown) => changeBalanceSchema.validate(req)
}
export { BalanceRequest }
