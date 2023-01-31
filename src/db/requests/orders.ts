import { StandingOrderRequest } from '../../API/validators/orderValidator'
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
  denomination: Denomination
}>

export const getStandingOrdersFromDb = async (filter: GetOrderFilter) =>
  db('public.standing_orders')
    .select<StandingOrder[]>(orderColumns)
    .where(filter)

export const getSingleStandingOrderFromDb = async (filters: GetOrderFilter) =>
  db('public.standing_orders')
    .select<StandingOrder[]>(orderColumns)
    .where(filters)
    .first()

export const insertStandingOrderToDb = async ({
  username,
  sellDenomination,
  buyDenomination,
  amount,
  limitPrice
}: StandingOrderRequest) =>
  (
    await db('public.standing_orders')
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
