import express from 'express'

import { getBalancesFromDb } from '../../../db/requests/balance'
import { log } from '../../../logging/logger'
import { authenticate } from '../../middleware/authenticate'
import { catchExceptions } from '../../utils/errorHandler'
import { validateBalance } from '../../validators/balanceValidator'
import { topup, withdraw } from './handlers/balanceUpdate'
import { handleGetBalance } from './handlers/getBalance'

const balanceRouter = express()
balanceRouter.use(authenticate)

balanceRouter.get('/', catchExceptions(handleGetBalance))

balanceRouter.post('/topup/:denomination', async (req, res) => {
  const { error, value } = validateBalance.topup({
    ...req.body,
    denomination: req.params.denomination
  })
  if (error) return res.sendStatus(400)

  const newBalance = await topup(value)

  return res.send({ message: 'OK', ...newBalance })
})

balanceRouter.post('/withdraw/:denomination', async (req, res) => {
  const { error, value } = validateBalance.withdraw({
    ...req.body,
    denomination: req.params.denomination
  })
  if (error) return res.sendStatus(400)

  const newBalance = await withdraw(value)
  return res.send({ message: 'OK', ...newBalance })
})

export { balanceRouter }
