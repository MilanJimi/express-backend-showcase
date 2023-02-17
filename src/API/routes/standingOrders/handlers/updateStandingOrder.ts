import { DB } from '@db/database'
import { StandingOrder } from '@db/requests/types'
import { UserFacingError } from '@utils/error'
import { Request, Response } from 'express'
import joiToSwagger from 'joi-to-swagger'
import { container } from 'tsyringe'

import { Denomination, ErrorCode, OrderStatus } from '../../../../enums'
import { log } from '../../../../logging/logger'
import {
  swgOkMessageSchema,
  userFacingErrorSchema
} from '../../../validators/schemas/swagger'
import { validateStandingOrder } from '../../../validators/standingOrderValidator'
import { UpdateStandingOrderRequest } from '../../../validators/types'

export const swgUpdateStandingOrder = {
  put: {
    summary: 'Update own standing order - if balance is sufficient',
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
          schema: joiToSwagger(validateStandingOrder.update).swagger
        }
      }
    },
    responses: {
      '200': {
        description: 'Success message',
        content: swgOkMessageSchema
      },
      '401': { description: 'Unauthorized (if updating not own order)' },
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

type BalanceAdjustmentParams = {
  order: StandingOrder
  newStatus?: OrderStatus
  newAmount?: number
  newLimitPrice?: number
}

type CheckEnoughBalanceParams = {
  username: string
  denomination: Denomination
  adjustment: number
}

const isCancelledAndNotReactivated = (
  { status: newStatus }: UpdateStandingOrderRequest,
  { status: currentStatus }: StandingOrder
) => newStatus !== OrderStatus.live && currentStatus === OrderStatus.cancelled

const getBalanceAdjustment = ({
  order,
  newStatus,
  newAmount,
  newLimitPrice
}: BalanceAdjustmentParams) => {
  const currentHold =
    order.status === OrderStatus.cancelled
      ? 0
      : order.quantity_outstanding * order.limit_price
  const newHold =
    newStatus === OrderStatus.cancelled
      ? 0
      : (newAmount ?? order.quantity_outstanding) *
        (newLimitPrice ?? order.limit_price)
  return currentHold - newHold
}

const checkEnoughBalance = async ({
  username,
  denomination,
  adjustment
}: CheckEnoughBalanceParams) => {
  const balance = await container
    .resolve(DB)
    .balance.getSingleBalance({ denomination, username })
  if (!balance || adjustment > balance.available_balance)
    throw new UserFacingError(ErrorCode.insufficientBalance)
}

export const handleUpdateStandingOrder = async (
  req: Request,
  res: Response
) => {
  const { error, value } = validateStandingOrder.update.validate(req.body)
  if (error) return res.sendStatus(400)

  const { username, newAmount, newLimitPrice, status: newStatus } = value
  const { id } = req.params
  const order = await container
    .resolve(DB)
    .standingOrder.getSingleStandingOrder({ id })

  if (!order) throw new UserFacingError(ErrorCode.orderNotFound, 404)
  if (order.username !== value.username) return res.sendStatus(401)
  if (isCancelledAndNotReactivated(value, order))
    throw new UserFacingError(ErrorCode.orderCancelled)

  const adjustment = getBalanceAdjustment({
    order,
    newStatus,
    newAmount,
    newLimitPrice
  })
  log(
    'info',
    `Adjustment of order ${order.id} calculated as ${adjustment} ${order.sell_denomination}`
  )
  if (adjustment < 0)
    await checkEnoughBalance({
      username,
      denomination: order.sell_denomination,
      adjustment
    })

  await container.resolve(DB).standingOrder.updateSingleStandingOrder(id, {
    ...value,
    denomination: order.sell_denomination,
    balanceAdjustment: adjustment
  })

  return res.send({ message: 'OK' })
}
