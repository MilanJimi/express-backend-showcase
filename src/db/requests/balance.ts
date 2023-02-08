import { Knex } from 'knex'
import { UserFacingError } from '../../API/utils/error'
import { db } from '../dbConnector'
import {
  Balance,
  GetBalanceFilters,
  UpsertBalanceParams,
  PutMoneyOnHoldParams
} from './types'

const balanceColumns = [
  'user_balances.id',
  'user_balances.username',
  'user_balances.denomination',
  'user_balances.balance',
  'user_balances.available_balance'
]
export const getBalancesDB = async (username: string) =>
  db('public.user_balances')
    .select<Balance[]>(balanceColumns)
    .where({ username })

export const getSingleBalanceDB = async (filters: GetBalanceFilters) =>
  db('public.user_balances')
    .select<Balance[]>(balanceColumns)
    .where(filters)
    .first()

export const upsertBalanceDB = async (
  trx: Knex.Transaction,
  {
    username,
    denomination,
    amount,
    skipAvailableBalanceUpdate
  }: UpsertBalanceParams
) =>
  trx('public.user_balances')
    .insert({
      username,
      denomination,
      balance: amount,
      available_balance: amount
    })
    .onConflict(['username', 'denomination'])
    .merge({
      balance: trx.raw('?? + ?', ['user_balances.balance', amount]),
      available_balance: trx.raw('?? + ?', [
        'user_balances.available_balance',
        skipAvailableBalanceUpdate ? 0 : amount
      ])
    })

export const putMoneyOnHoldDB = async (
  trx: Knex.Transaction,
  { username, denomination, amount }: PutMoneyOnHoldParams
) => {
  const currentBalance = await getSingleBalanceDB({
    username,
    denomination
  })
  if (!currentBalance || amount > currentBalance.available_balance)
    throw new UserFacingError(`ERROR_INSUFFICIENT_BALANCE_${denomination}`)
  return await trx('public.user_balances')
    .decrement('available_balance', amount)
    .where({ username, denomination })
    .returning<Balance[]>(balanceColumns)
}
