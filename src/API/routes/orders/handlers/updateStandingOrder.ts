import { Request, Response } from 'express'

import { validateOrder } from '../../../validators/orderValidator'
import { newStandingOrder } from '../../../../methods/fulfillment/standingOrder'

export const handleUpdateStandingOrder = async (
  req: Request,
  res: Response
) => {
  const { error, value } = validateOrder.newStandingOrder(req.body)
  if (error) return res.sendStatus(400)

  const response = await newStandingOrder(value)
  return res.send(response)
}
