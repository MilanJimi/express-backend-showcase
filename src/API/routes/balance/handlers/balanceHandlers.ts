import { Request, Response } from 'express'
import { validateBalance } from '../../../validators/balanceValidator'
import { topup, withdraw } from './balanceUpdate'

export const handleTopup = async (req: Request, res: Response) => {
  const { error, value } = validateBalance.topup({
    ...req.body,
    denomination: req.params.denomination
  })
  if (error) return res.sendStatus(400)

  const newBalance = await topup(value)

  return res.send({ message: 'OK', ...newBalance })
}

export const handleWithdraw = async (req: Request, res: Response) => {
  const { error, value } = validateBalance.withdraw({
    ...req.body,
    denomination: req.params.denomination
  })
  if (error) return res.sendStatus(400)

  const newBalance = await withdraw(value)
  return res.send({ message: 'OK', ...newBalance })
}
