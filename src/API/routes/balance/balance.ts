import express from 'express'

import { authenticate } from '../../middleware/authenticate'
import { catchExceptions } from '../../utils/errorHandler'
import { handleTopup, handleWithdraw } from './handlers/balanceHandlers'
import { handleGetBalance } from './handlers/getBalance'

const balanceRouter = express()
balanceRouter.use(authenticate)

balanceRouter.get('/', catchExceptions(handleGetBalance))

balanceRouter.post('/topup/:denomination', catchExceptions(handleTopup))

balanceRouter.post('/withdraw/:denomination', catchExceptions(handleWithdraw))

export { balanceRouter }
