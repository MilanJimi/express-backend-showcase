import { Request, Response } from 'express'

import { putMoneyOnHoldInDb } from '../../../../db/requests/balance'
import { insertStandingOrderToDb } from '../../../../db/requests/orders'
import {
  StandingOrderRequest,
  validateOrder
} from '../../../validators/orderValidator'

const newStandingOrder = async (params: StandingOrderRequest) => {
  await putMoneyOnHoldInDb(
    params.username,
    params.sellDenomination,
    params.amount
  )
  const response = await insertStandingOrderToDb(params)
  return response
}

export const handleNewStandingOrder = async (req: Request, res: Response) => {
  const { error, value } = validateOrder.newStandingOrder(req.body)
  if (error) return res.sendStatus(400)

  const response = await newStandingOrder(value)
  return res.send(response)
}
