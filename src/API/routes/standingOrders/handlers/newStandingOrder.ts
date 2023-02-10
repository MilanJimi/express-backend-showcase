import { Request, Response } from 'express'

import { validateStandingOrder } from '../../../validators/standingOrderValidator'
import { automaticFulfillOrder } from '../../../../methods/fulfillment/automaticFulfill'
import { OrderType } from '../../../../methods/fulfillment/types'

export const handleNewStandingOrder = async (req: Request, res: Response) => {
  const { error, value } = validateStandingOrder.new(req.body)
  if (error) return res.sendStatus(400)

  const response = await automaticFulfillOrder({
    ...value,
    type: OrderType.standing
  })
  return res.send(response)
}
