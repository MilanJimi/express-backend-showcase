import { BalanceRequest } from '@api/validators/types'
import { UserFacingError } from '@utils/error'
import { Knex } from 'knex'
import { injectable } from 'tsyringe'

import { Denomination, ErrorCode } from '../../enums'
import { dbClient } from '../client'
import {
  Balance,
  GetBalanceFilters,
  PutMoneyOnHoldParams,
  TransferBalanceParams,
  UpsertBalanceParams
} from './types'

const balanceColumns = [
  'user_balances.id',
  'user_balances.username',
  'user_balances.denomination',
  'user_balances.balance',
  'user_balances.available_balance'
]

@injectable()
export class BalanceController {
  getBalances = async (username: string) =>
    dbClient('public.user_balances')
      .select<Balance[]>(balanceColumns)
      .where({ username })

  getSingleBalance = async (filters: GetBalanceFilters) =>
    dbClient('public.user_balances')
      .select<Balance[]>(balanceColumns)
      .where(filters)
      .first()

  adjustAvailableBalance = async (
    trx: Knex.Transaction,
    username: string,
    denomination: Denomination,
    amount: number
  ) =>
    trx('public.user_balances')
      .increment('available_balance', amount)
      .where({ username, denomination })
      .returning<Balance[]>(balanceColumns)

  upsertBalance = async (
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

  updateBalance = async ({
    username,
    denomination,
    amount
  }: BalanceRequest) => {
    return dbClient.transaction((trx) =>
      this.upsertBalance(trx, {
        username,
        denomination,
        amount
      })
    )
  }

  putMoneyOnHold = async (
    trx: Knex.Transaction,
    { username, denomination, amount }: PutMoneyOnHoldParams
  ) => {
    const currentBalance = await this.getSingleBalance({
      username,
      denomination
    })
    if (!currentBalance || amount > currentBalance.available_balance)
      throw new UserFacingError(ErrorCode.insufficientBalance)
    return await this.adjustAvailableBalance(
      trx,
      username,
      denomination,
      -amount
    )
  }

  transferBalance = async (
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
      this.upsertBalance(trx, {
        username: buyerUsername,
        denomination: sellDenomination,
        amount: buyAmount
      }),
      this.upsertBalance(trx, {
        username: sellerUsername,
        denomination: sellDenomination,
        amount: -buyAmount,
        skipAvailableBalanceUpdate: isFromHeldBalance
      }),
      this.upsertBalance(trx, {
        username: buyerUsername,
        denomination: buyDenomination,
        amount: -sellAmount
      }),
      this.upsertBalance(trx, {
        username: sellerUsername,
        denomination: buyDenomination,
        amount: sellAmount
      })
    ])
}
