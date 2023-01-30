import express from 'express'

import { getBalancesFromDb } from '../../../db/requests/balance'
import { log } from '../../../logger'
import { authenticate } from '../../middleware/authenticate'
import { validateBalance } from '../../validators/balanceValidator'
import { topup, withdraw } from './balanceUpdate'

const balanceRouter = express()
balanceRouter.use(authenticate)

balanceRouter.get('/', async (req, res) => {
  const username = req.body.username as string
  const balances = await getBalancesFromDb(username)
  return res.send(balances)
})

balanceRouter.post('/topup/:denomination', async (req, res) => {
  const { error, value } = validateBalance.topup({
    ...req.body,
    denomination: req.params.denomination
  })
  if (error) return res.sendStatus(401)

  const newBalance = await topup(value)

  return res.send({ message: 'OK', ...newBalance })
})

balanceRouter.post('/withdraw/:denomination', async (req, res) => {
  const { error, value } = validateBalance.withdraw({
    ...req.body,
    denomination: req.params.denomination
  })
  if (error) return res.sendStatus(401)

  try {
    const newBalance = await withdraw(value)
    return res.send({ message: 'OK', ...newBalance })
  } catch (e: unknown) {
    if (e instanceof Error) {
      log('error', e.message)
      return res.send({ message: e.message })
    }
    return res.status(500)
  }
})

export { balanceRouter }
