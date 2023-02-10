import { validateMarketOrder } from '../../../validators/marketOrderValidator'
import { Request, Response } from 'express'
import { MarketOrderRequest } from '../../../validators/types'
import { automaticFulfillOrder } from '../../../../methods/fulfillment/automaticFulfill'
import { OrderType } from '../../../../methods/fulfillment/types'

const newMarketOrder = async (params: MarketOrderRequest) => {
  await automaticFulfillOrder({ ...params, type: OrderType.market })
}

export const handleNewMarketOrder = async (req: Request, res: Response) => {
  const { error, value } = validateMarketOrder.new(req.body)
  if (error) return res.sendStatus(400)

  await newMarketOrder(value)
  return res.send('OK')
}
