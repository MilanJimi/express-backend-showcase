import knex, { Knex } from 'knex'
import { Pagination } from '../../API/utils/pagination'
import { StandingOrderRequest } from '../../API/validators/orderValidator'
import { filterNil } from '../../utils/objectUtils'
import { db } from '../dbConnector'

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
  limit_price: string
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
    .andWhere('standing_orders.quantity_outstanding', '>=', amount)
    .decrement('standing_orders.quantity_outstanding', amount)

const setStatusFulfilledIfZeroOutstandingDB = (
  trx: Knex.Transaction,
  id: string
) =>
  trx('public.standing_orders')
    .where({ id })
    .andWhere('standing_orders.quantity_outstanding', '=', 0)
    .update('standing_orders.status', OrderStatus.fulfilled)

export const fulfillOrderDB = (id: string, amount: number) =>
  db.transaction(async (trx) => {
    await subtractAmountFromStandingOrderDB(trx, id, amount)
    await setStatusFulfilledIfZeroOutstandingDB(trx, id)
  })
