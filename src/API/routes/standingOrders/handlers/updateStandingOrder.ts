import { Request, Response } from 'express'

import { validateStandingOrder } from '../../../validators/standingOrderValidator'
import {
  getSingleStandingOrderDB,
  updateSingleStandingOrderDB
} from '../../../../db/requests/standingOrders'
import {
  Denomination,
  OrderStatus,
  StandingOrder
} from '../../../../db/requests/types'
import { getSingleBalanceDB } from '../../../../db/requests/balance'
import { UserFacingError } from '../../../utils/error'
import { UpdateStandingOrderRequest } from '../../../validators/types'
import { log } from '../../../../logging/logger'

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
  const balance = await getSingleBalanceDB({ denomination, username })
  if (!balance) throw new UserFacingError('ERROR_BALANCE_NOT_FOUND')
  if (adjustment > balance.available_balance)
    throw new UserFacingError('ERROR_INSUFFICIENT_BALANCE')
}

export const handleUpdateStandingOrder = async (
  req: Request,
  res: Response
) => {
  const { error, value } = validateStandingOrder.update(req.body)
  if (error) return res.sendStatus(400)

  const { username, newAmount, newLimitPrice, status: newStatus } = value
  const { id } = req.params
  const order = await getSingleStandingOrderDB({ id })

  if (!order) return res.sendStatus(404)
  if (order.username !== value.username) return res.sendStatus(401)
  if (isCancelledAndNotReactivated(value, order))
    throw new UserFacingError('ERROR_ORDER_CANCELLED')

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

  await updateSingleStandingOrderDB(id, {
    ...value,
    denomination: order.sell_denomination,
    balanceAdjustment: adjustment
  })

  return res.send({ message: 'OK' })
}
