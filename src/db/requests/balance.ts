import { Knex } from 'knex'
import { UserFacingError } from '../../API/utils/error'
import { dbClient } from '../client'
import {
  Balance,
  GetBalanceFilters,
  UpsertBalanceParams,
  PutMoneyOnHoldParams,
  TransferBalanceParams
} from './types'
import { Denomination, ErrorCode } from '../../enums'

const balanceColumns = [
  'user_balances.id',
  'user_balances.username',
  'user_balances.denomination',
  'user_balances.balance',
  'user_balances.available_balance'
]

const getBalances = async (username: string) =>
  dbClient('public.user_balances')
    .select<Balance[]>(balanceColumns)
    .where({ username })

const getSingleBalance = async (filters: GetBalanceFilters) =>
  dbClient('public.user_balances')
    .select<Balance[]>(balanceColumns)
    .where(filters)
    .first()

const adjustAvailableBalance = async (
  trx: Knex.Transaction,
  username: string,
  denomination: Denomination,
  amount: number
) =>
  trx('public.user_balances')
    .increment('available_balance', amount)
    .where({ username, denomination })
    .returning<Balance[]>(balanceColumns)

const upsertBalance = async (
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

const putMoneyOnHold = async (
  trx: Knex.Transaction,
  { username, denomination, amount }: PutMoneyOnHoldParams
) => {
  const currentBalance = await getSingleBalance({
    username,
    denomination
  })
  if (!currentBalance || amount > currentBalance.available_balance)
    throw new UserFacingError(ErrorCode.insufficientBalance)
  return await adjustAvailableBalance(trx, username, denomination, -amount)
}

const transferBalance = async (
  trx: Knex.Transaction,
  {
    buyerUsername,
    sellerUsername,
    buyDenomination,
    sellDenomination,
    buyAmount,
    sellAmount,
    isFromHeldBalance
  }: TransferBalanceParams
) =>
  Promise.all([
    upsertBalance(trx, {
      username: buyerUsername,
      denomination: sellDenomination,
      amount: buyAmount
    }),
    upsertBalance(trx, {
      username: sellerUsername,
      denomination: sellDenomination,
      amount: -buyAmount,
      skipAvailableBalanceUpdate: isFromHeldBalance
    }),
    upsertBalance(trx, {
      username: buyerUsername,
      denomination: buyDenomination,
      amount: -sellAmount
    }),
    upsertBalance(trx, {
      username: sellerUsername,
      denomination: buyDenomination,
      amount: sellAmount
    })
  ])

export const balanceDbQueries = {
  getBalances,
  getSingleBalance,
  adjustAvailableBalance,
  upsertBalance,
  putMoneyOnHold,
  transferBalance
}
