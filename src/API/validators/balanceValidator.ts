import { changeBalanceSchema } from './schemas/balanceSchemas'
import { BalanceRequest } from './types'

export const validateBalance = {
  topup: changeBalanceSchema,
  withdraw: changeBalanceSchema
}
export { BalanceRequest }
