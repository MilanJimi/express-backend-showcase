import { Request, Response } from 'express'
import { getBalancesDB } from '../../../../db/requests/balance'

export const handleGetBalance = async (req: Request, res: Response) => {
  const username = req.body.username as string
  const balances = await getBalancesDB(username)
  return res.send(balances)
}
