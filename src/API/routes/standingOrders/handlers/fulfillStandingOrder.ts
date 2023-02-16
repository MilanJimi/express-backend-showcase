import { Request, Response } from 'express'
import joiToSwagger from 'joi-to-swagger'
import { db } from '../../../../db/database'

import { ErrorCode, OrderStatus } from '../../../../enums'
import { UserFacingError } from '../../../utils/error'
import {
  swgOkMessageSchema,
  userFacingErrorSchema
} from '../../../validators/schemas/swagger'
import { validateStandingOrder } from '../../../validators/standingOrderValidator'
import { FulfillStandingOrderRequest } from '../../../validators/types'

export const swgFulfillStandingOrder = {
  post: {
    summary: 'Fulfill given order up to an amount - if balance is sufficient',
    tags: ['Standing Orders'],
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: joiToSwagger(validateStandingOrder.fulfill).swagger
        }
      }
    },
    responses: {
      '200': {
        description: 'Success message',
        content: swgOkMessageSchema
      },
      '404': {
        description: 'Not Found',
        content: userFacingErrorSchema([ErrorCode.orderNotFound])
      },
      '500': {
        description: 'Error',
        content: userFacingErrorSchema([
          ErrorCode.orderFulfilled,
          ErrorCode.orderSmallerThanAmount,
          ErrorCode.insufficientBalance
        ])
      }
    }
  }
}

const fulfillOrder = async (
  orderId: string,
  { username, amount }: FulfillStandingOrderRequest
) => {
  const order = await db.getSingleStandingOrder({ id: orderId })
  if (!order) throw new UserFacingError(ErrorCode.orderNotFound, 404)
  if (order.status === OrderStatus.fulfilled)
    throw new UserFacingError(ErrorCode.orderFulfilled)
  if (order.quantity_outstanding < amount)
    throw new UserFacingError(ErrorCode.orderSmallerThanAmount)

  const currentBalance = await db.getSingleBalance({
    username,
    denomination: order.buy_denomination
  })
  if (!currentBalance || currentBalance.available_balance < amount)
    throw new UserFacingError(ErrorCode.insufficientBalance)

  await db.fulfillOrder({ order, buyerUsername: username, amount })
}

export const handleFulfillOrder = async (req: Request, res: Response) => {
  const { error, value } = validateStandingOrder.fulfill.validate(req.body)
  if (error) return res.sendStatus(400)
  const orderId = req.params.id

  await fulfillOrder(orderId, value)
  return res.send('OK')
}
