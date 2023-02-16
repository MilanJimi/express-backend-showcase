import { Knex } from 'knex'

import { UserFacingError } from '../../API/utils/error'
import { StandingOrderRequest } from '../../API/validators/types'
import { filterNil } from '../../utils/objectUtils'
import { dbClient } from '../client'
import { buildOrdering } from '../utils/sorting'
import {
  FulfillOrderParams,
  GetOrderFilter,
  StandingOrder,
  UpdateStandingOrderParams
} from './types'
import { ErrorCode, OrderStatus } from '../../enums'
import { db } from '../database'

const orderColumns = [
  'standing_orders.id',
  'standing_orders.username',
  'standing_orders.status',
  'standing_orders.sell_denomination',
  'standing_orders.buy_denomination',
  'standing_orders.limit_price',
  'standing_orders.quantity_original',
  'standing_orders.quantity_outstanding'
]

export const standingOrderSorting = {
  priceDesc: { column: 'limit_price', direction: 'desc' }
} as const

const getStandingOrders = async ({
  id,
  username,
  status,
  buyDenomination,
  sellDenomination,
  offset,
  minPrice,
  perPage,
  orderBy
}: GetOrderFilter) =>
  dbClient('public.standing_orders')
    .where(
      filterNil({
        id,
        username,
        status,
        buy_denomination: buyDenomination,
        sell_denomination: sellDenomination
      })
    )
    .modify((builder) => {
      buildOrdering(builder, standingOrderSorting.priceDesc, orderBy)
      if (minPrice) builder.andWhere('limit_price', '>=', minPrice)
      if (offset) builder.offset(offset)
      if (perPage) builder.limit(perPage)
    })
    .select<StandingOrder[]>(orderColumns)

const updateSingleStandingOrder = async (
  id: string,
  {
    username,
    newAmount: adjustAmount,
    newLimitPrice: limitPrice,
    status,
    balanceAdjustment
  }: UpdateStandingOrderParams
) =>
  dbClient.transaction(async (trx) => {
    const [{ sell_denomination }] = await trx('public.standing_orders')
      .where({ id })
      .update(
        filterNil({
          status,
          limit_price: limitPrice,
          quantity_outstanding: adjustAmount
        })
      )
      .returning('sell_denomination')
    if (balanceAdjustment) {
      await db.adjustAvailableBalance(
        trx,
        username,
        sell_denomination,
        balanceAdjustment
      )
    }
  })

const getSingleStandingOrder = async (filters: GetOrderFilter) =>
  dbClient('public.standing_orders')
    .select<StandingOrder[]>(orderColumns)
    .where(filters)
    .first()

const insertStandingOrder = async (
  trx: Knex.Transaction,
  {
    username,
    sellDenomination,
    buyDenomination,
    amount,
    outstandingAmount,
    limitPrice
  }: StandingOrderRequest
) =>
  (
    await trx('public.standing_orders')
      .insert({
        username,
        buy_denomination: buyDenomination,
        sell_denomination: sellDenomination,
        quantity_original: amount,
        quantity_outstanding: outstandingAmount ?? amount,
        limit_price: limitPrice,
        status:
          outstandingAmount && outstandingAmount > 0
            ? OrderStatus.live
            : OrderStatus.fulfilled
      })
      .returning<StandingOrder[]>(orderColumns)
  )[0]

const subtractAmountFromStandingOrder = async (
  trx: Knex.Transaction,
  id: string,
  amount: number
) =>
  trx('public.standing_orders')
    .where({ id })
    .andWhere('quantity_outstanding', '>=', amount)
    .decrement('quantity_outstanding', amount)

const setStatusFulfilledIfZeroOutstanding = (
  trx: Knex.Transaction,
  id: string
) =>
  trx('public.standing_orders')
    .where({ id })
    .andWhere('quantity_outstanding', '=', 0)
    .update('status', OrderStatus.fulfilled)

const fulfillOrder = async (
  { order, buyerUsername, amount }: FulfillOrderParams,
  trx?: Knex.Transaction
) => {
  const currentBalance = await db.getSingleBalance({
    username: buyerUsername,
    denomination: order.buy_denomination
  })
  if (!currentBalance || currentBalance.available_balance < amount)
    throw new UserFacingError(ErrorCode.insufficientBalance)

  await (trx ?? dbClient).transaction(async (trx) => {
    await Promise.all([
      subtractAmountFromStandingOrder(trx, order.id, amount),
      db.transferBalance(trx, {
        buyerUsername,
        sellerUsername: order.username,
        buyDenomination: order.buy_denomination,
        sellDenomination: order.sell_denomination,
        buyAmount: amount,
        sellAmount: amount / order.limit_price,
        isFromHeldBalance: true
      })
    ])
    await setStatusFulfilledIfZeroOutstanding(trx, order.id)
  })
}

const createNewStandingOrder = (
  trx: Knex.Transaction,
  params: StandingOrderRequest
) =>
  trx.transaction(async (trx) => {
    await db.putMoneyOnHold(trx, {
      username: params.username,
      amount: params.outstandingAmount ?? params.amount,
      denomination: params.sellDenomination
    })
    const response = await insertStandingOrder(trx, params)
    return response
  })

export const standingOrderDbQueries = {
  getStandingOrders,
  updateSingleStandingOrder,
  getSingleStandingOrder,
  insertStandingOrder,
  fulfillOrder,
  createNewStandingOrder
}
