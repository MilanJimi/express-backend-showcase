import { validateBalance } from '@api/validators/balanceValidator'
import { Request, Response } from 'express'
import { injectable } from 'tsyringe'

import { BalanceService } from '../service/balanceService'

@injectable()
export class BalanceHandler {
  constructor(private service: BalanceService) {}

  getBalance = async (req: Request, res: Response) => {
    const username = req.body.username as string
    const balances = await this.service.getAll(username)
    return res.send(balances)
  }

  topup = async (req: Request, res: Response) => {
    const { error, value } = validateBalance.topup.validate({
      ...req.body,
      denomination: req.params.denomination
    })
    if (error) return res.sendStatus(400)

    await this.service.topup(value)

    return res.send({ message: 'OK' })
  }

  withdraw = async (req: Request, res: Response) => {
    const { error, value } = validateBalance.withdraw.validate({
      ...req.body,
      denomination: req.params.denomination
    })
    if (error) return res.sendStatus(400)

    const newBalance = await this.service.withdraw(value)
    return res.send({ message: 'OK', ...newBalance })
  }
}
