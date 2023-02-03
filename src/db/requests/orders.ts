import { Knex } from 'knex'

import { UserFacingError } from '../../API/utils/error'
import { Pagination } from '../../API/utils/pagination'
import { StandingOrderRequest } from '../../API/validators/orderValidator'
import { filterNil } from '../../utils/objectUtils'
import { db } from '../dbConnector'
import { getSingleBalanceDB, upsertBalanceDB } from './balance'

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

export enum OrderStatus {
  live = 'LIVE',
  fulfilled = 'FULFILLED',
  cancelled = 'CANCELLED'
}

export enum Denomination {
  AUD = 'AUD',
  EUR = 'EUR',
  USD = 'USD'
}

type StandingOrder = {
  id: string
  username: string
  status: OrderStatus
  sell_denomination: Denomination
  buy_denomination: Denomination
  limit_price: number
  quantity_original: number
  quantity_outstanding: number
}

type GetOrderFilter = Partial<{
  id: string
  username: string
  status: OrderStatus
  buyDenomination: Denomination
  sellDenomination: Denomination
}>

export const getStandingOrdersDB = async (
  { offset, perPage }: Pagination,
  { id, username, status, buyDenomination, sellDenomination }: GetOrderFilter
) =>
  db('public.standing_orders')
    .select<StandingOrder[]>(orderColumns)
    .where(
      filterNil({
        id,
        username,
        status,
        buy_denomination: buyDenomination,
        sell_denomination: sellDenomination
      })
    )
    .offset(offset)
    .limit(perPage)

export const getSingleStandingOrderDB = async (filters: GetOrderFilter) =>
  db('public.standing_orders')
    .select<StandingOrder[]>(orderColumns)
    .where(filters)
    .first()

export const insertStandingOrderDB = async (
  trx: Knex.Transaction,
  {
    username,
    sellDenomination,
    buyDenomination,
    amount,
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
        quantity_outstanding: amount,
        limit_price: limitPrice,
        status: OrderStatus.live
      })
      .returning<StandingOrder[]>(orderColumns)
  )[0]

const subtractAmountFromStandingOrderDB = async (
  trx: Knex.Transaction,
  id: string,
  amount: number
) =>
  trx('public.standing_orders')
    .where({ id })
    .andWhere('quantity_outstanding', '>=', amount)
    .decrement('quantity_outstanding', amount)

const setStatusFulfilledIfZeroOutstandingDB = (
  trx: Knex.Transaction,
  id: string
) =>
  trx('public.standing_orders')
    .where({ id })
    .andWhere('quantity_outstanding', '=', 0)
    .update('status', OrderStatus.fulfilled)

export const fulfillOrderDB = async (
  order: StandingOrder,
  buyerUsername: string,
  amount: number
) => {
  const currentBalance = await getSingleBalanceDB({
    username: buyerUsername,
    denomination: order.buy_denomination
  })
  if (!currentBalance || currentBalance.available_balance < amount)
    throw new UserFacingError(
      `ERROR_INSUFFICIENT_BALANCE_${order.buy_denomination}`
    )

  await db.transaction(async (trx) => {
    await Promise.all([
      subtractAmountFromStandingOrderDB(trx, order.id, amount),
      upsertBalanceDB(trx, {
        username: buyerUsername,
        denomination: order.sell_denomination,
        amount
      }),
      upsertBalanceDB(trx, {
        username: order.username,
        denomination: order.sell_denomination,
        amount: -amount,
        skipAvailableBalanceUpdate: true
      }),
      upsertBalanceDB(trx, {
        username: buyerUsername,
        denomination: order.buy_denomination,
        amount: -amount / order.limit_price
      }),
      upsertBalanceDB(trx, {
        username: order.username,
        denomination: order.buy_denomination,
        amount: amount / order.limit_price
      })
    ])
    await setStatusFulfilledIfZeroOutstandingDB(trx, order.id)
  })
}
