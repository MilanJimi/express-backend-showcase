import { Request, Response } from 'express'

import { getSingleBalanceDB } from '../../../../db/requests/balance'
import {
  fulfillOrderDB,
  getSingleStandingOrderDB,
  OrderStatus
} from '../../../../db/requests/orders'
import { UserFacingError } from '../../../utils/error'
import {
  FulfillStandingOrderRequest,
  validateOrder
} from '../../../validators/orderValidator'

const fulfillOrder = async (
  orderId: string,
  { username, amount }: FulfillStandingOrderRequest
) => {
  const order = await getSingleStandingOrderDB({ id: orderId })
  if (!order) throw new UserFacingError('ERROR_ORDER_NOT_FOUND')
  if (order.status === OrderStatus.fulfilled)
    throw new UserFacingError('ERROR_ORDER_ALREADY_FULFILLED')
  if (order.quantity_outstanding < amount)
    throw new UserFacingError('ERROR_ORDER_SMALLER_THAN_AMOUNT')

  const currentBalance = await getSingleBalanceDB({
    username,
    denomination: order.buy_denomination
  })
  if (!currentBalance || currentBalance.available_balance < amount)
    throw new UserFacingError('ERROR_INSUFFICIENT_BALANCE')

  await fulfillOrderDB(order, username, amount)
}

export const handleFulfillOrder = async (req: Request, res: Response) => {
  const { error, value } = validateOrder.fulfillStandingOrder(req.body)
  if (error) return res.sendStatus(400)
  const orderId = req.params.id

  await fulfillOrder(orderId, value)
  return res.send('OK')
}
