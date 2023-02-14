import express from 'express'

import { authenticate } from '../../middleware/authenticate'
import { catchExceptions } from '../../utils/errorHandler'
import { handleWithdraw, swgWithdraw } from './handlers/withdraw'
import { handleTopup, swgTopup } from './handlers/topup'
import { handleGetBalance, swgGetBalance } from './handlers/getBalance'

export const swgBalanceRouter = {
  '/balance': swgGetBalance,
  '/balance/topup/{denomination}': swgTopup,
  '/balance/withdraw/{denomination}': swgWithdraw
}

const balanceRouter = express()
balanceRouter.use(authenticate)

balanceRouter.get('/', catchExceptions(handleGetBalance))

balanceRouter.post('/topup/:denomination', catchExceptions(handleTopup))

balanceRouter.post('/withdraw/:denomination', catchExceptions(handleWithdraw))

export { balanceRouter }
