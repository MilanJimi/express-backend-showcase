import { catchExceptions } from '@api/utils/errorHandler'
import express from 'express'

import { authenticate } from '../../middleware/authenticate'
import { handleGetBalance, swgGetBalance } from './handlers/getBalance'
import { handleTopup, swgTopup } from './handlers/topup'
import { handleWithdraw, swgWithdraw } from './handlers/withdraw'

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
