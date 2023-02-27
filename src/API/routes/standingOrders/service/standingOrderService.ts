import { BalanceService } from '@api/routes/balance/service/balanceService'
import { getPagination } from '@api/utils/pagination'
import {
  FulfillStandingOrderRequest,
  UpdateStandingOrderRequest
} from '@api/validators/types'
import { DB } from '@db/database'
import { GetOrderFilter } from '@db/requests/types'
import { UserFacingError } from '@utils/error'
import { ErrorCode, OrderStatus } from 'src/enums'
import { log } from 'src/logging/logger'
import { injectable } from 'tsyringe'

import { getBalanceAdjustment, isCancelledAndNotReactivated } from './helpers'

@injectable()
export class StandingOrderService {
  constructor(private db: DB, private balanceService: BalanceService) {}

  getSingle = (id: string) =>
    this.db.standingOrder.getSingleStandingOrder({ id })

  getMultiple = async (
    filter: GetOrderFilter,
    perPage?: number,
    page?: number
  ) => {
    const pagination = getPagination(perPage, page)
    return await this.db.standingOrder.getStandingOrders({
      ...filter,
      ...pagination
    })
  }
  fulfillOrder = async (
    orderId: string,
    { username, amount }: FulfillStandingOrderRequest
  ) => {
    const order = await this.db.standingOrder.getSingleStandingOrder({
      id: orderId
    })
    if (!order) throw new UserFacingError(ErrorCode.orderNotFound, 404)
    if (order.status === OrderStatus.fulfilled)
      throw new UserFacingError(ErrorCode.orderFulfilled)
    if (order.quantity_outstanding < amount)
      throw new UserFacingError(ErrorCode.orderSmallerThanAmount)

    const currentBalance = await this.db.balance.getSingleBalance({
      username,
      denomination: order.buy_denomination
    })
    if (!currentBalance || currentBalance.available_balance < amount)
      throw new UserFacingError(ErrorCode.insufficientBalance)

    await this.db.standingOrder.fulfillOrder({
      order,
      buyerUsername: username,
      amount
    })
  }

  updateOrder = async (
    id: string,
    { username, status, newAmount, newLimitPrice }: UpdateStandingOrderRequest
  ) => {
    const order = await this.db.standingOrder.getSingleStandingOrder({
      id
    })
    if (!order) throw new UserFacingError(ErrorCode.orderNotFound, 404)
    if (order.username !== username)
      throw new UserFacingError(ErrorCode.unauthorized, 401)
    if (isCancelledAndNotReactivated(order.status, status))
      throw new UserFacingError(ErrorCode.orderCancelled)

    const adjustment = getBalanceAdjustment({
      order,
      newStatus: status,
      newAmount,
      newLimitPrice
    })
    log(
      'info',
      `Adjustment of order ${order.id} calculated as ${adjustment} ${order.sell_denomination}`
    )
    if (adjustment < 0)
      await this.balanceService.checkEnoughBalance({
        username,
        denomination: order.sell_denomination,
        adjustment
      })

    await this.db.standingOrder.updateSingleStandingOrder(id, {
      username,
      status,
      newAmount,
      newLimitPrice,
      denomination: order.sell_denomination,
      balanceAdjustment: adjustment
    })
  }
}
