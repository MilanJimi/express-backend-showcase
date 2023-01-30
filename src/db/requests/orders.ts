import { db } from '../dbConnector'

const orderColumns = [
  'standing_orders.id',
  'standing_orders.username',
  'standing_orders.denomination',
  'standing_orders.balance'
]

type Balance = {
  id: string
  username: string
  denomination: string
  balance: number
}

type GetOrderFilter = Partial<{
  id: string
  username: string
  status: ['LIVE', 'FULFILLED', 'CANCELLED']
  denomination: string
}>

export const getOrdersFromDb = async (filter: string) =>
  db('public.standing_orders').select<Balance[]>(orderColumns).where(filter)

export const getSingleOrderFromDb = async (filters: GetOrderFilter) =>
  db('public.user_balances')
    .select<Balance[]>(orderColumns)
    .where(filters)
    .first()

export const upsertOrderToDb = async (
  username: string,
  denomination: string,
  balance: number
) => {
  await db('public.user_balances')
    .insert({
      username,
      denomination,
      balance
    })
    .onConflict(['username', 'denomination'])
    .merge()
}
