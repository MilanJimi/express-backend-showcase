import { Request, Response } from 'express'
import { getBalancesFromDb } from '../../../../db/requests/balance'

export const handleGetBalance = async (req: Request, res: Response) => {
  const username = req.body.username as string
  const balances = await getBalancesFromDb(username)
  return res.send(balances)
}
