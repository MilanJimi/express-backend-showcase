import { db } from '../dbConnector'
import { Denomination } from './orders'

const balanceColumns = [
  'user_balances.id',
  'user_balances.username',
  'user_balances.denomination',
  'user_balances.balance',
  'user_balances.available_balance'
]
type Balance = {
  id: string
  username: string
  denomination: Denomination
  balance: number
  availableBalance: number
}
type GetBalanceFilters = {
  username: string
  denomination: Denomination
}

export const getBalancesFromDb = async (username: string) =>
  db('public.user_balances')
    .select<Balance[]>(balanceColumns)
    .where({ username })

export const getSingleBalanceFromDb = async (filters: GetBalanceFilters) =>
  db('public.user_balances')
    .select<Balance[]>(balanceColumns)
    .where(filters)
    .first()

export const upsertBalanceToDb = async (
  username: string,
  denomination: Denomination,
  newBalance: number
) =>
  await db('public.user_balances')
    .insert({
      username: username,
      denomination,
      balance: newBalance
    })
    .onConflict(['username', 'denomination'])
    .merge()
    .returning<Balance[]>(balanceColumns)
