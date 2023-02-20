import { catchExceptions } from '@api/utils/errorHandler'
import express from 'express'
import { container } from 'tsyringe'

import { authenticate } from '../../middleware/authenticate'
import { BalanceHandler } from './handlers/balanceHandler'
import { swgGetBalance, swgTopup, swgWithdraw } from './handlers/swagger'

export const swgBalanceRouter = {
  '/balance': swgGetBalance,
  '/balance/topup/{denomination}': swgTopup,
  '/balance/withdraw/{denomination}': swgWithdraw
}

const balanceRouter = express()
balanceRouter.use(authenticate)

const handler = container.resolve(BalanceHandler)

balanceRouter.get('/', catchExceptions(handler.getBalance))

balanceRouter.post('/topup/:denomination', catchExceptions(handler.topup))

balanceRouter.post('/withdraw/:denomination', catchExceptions(handler.withdraw))

export { balanceRouter }
