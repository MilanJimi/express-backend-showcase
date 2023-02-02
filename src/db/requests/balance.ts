import { Knex } from 'knex'
import { UserFacingError } from '../../API/utils/error'
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
  available_balance: number
}
type GetBalanceFilters = {
  username: string
  denomination: Denomination
}

type UpsertBalanceParams = {
  username: string
  denomination: Denomination
  newBalance: number
  newAvailableBalance: number
}
interface PutMoneyOnHoldParams {
  username: string
  denomination: Denomination
  amount: number
}

export const getBalancesDB = async (username: string) =>
  db('public.user_balances')
    .select<Balance[]>(balanceColumns)
    .where({ username })

export const getSingleBalanceDB = async (filters: GetBalanceFilters) =>
  db('public.user_balances')
    .select<Balance[]>(balanceColumns)
    .where(filters)
    .first()

export const upsertBalanceDB = async ({
  username,
  denomination,
  newBalance,
  newAvailableBalance
}: UpsertBalanceParams) =>
  await db('public.user_balances')
    .insert({
      username,
      denomination,
      balance: newBalance,
      available_balance: newAvailableBalance
    })
    .onConflict(['username', 'denomination'])
    .merge()
    .returning<Balance[]>(balanceColumns)

export const putMoneyOnHoldDB = async (
  trx: Knex.Transaction,
  { username, denomination, amount }: PutMoneyOnHoldParams
) => {
  const currentBalance = await getSingleBalanceDB({
    username,
    denomination
  })
  if (!currentBalance || amount > currentBalance.available_balance)
    throw new UserFacingError(`NOT_ENOUGH_BALANCE_${denomination}`)
  return await trx('public.user_balances')
    .update({
      available_balance: currentBalance.available_balance - amount
    })
    .where({ username, denomination })
    .returning<Balance[]>(balanceColumns)
}
