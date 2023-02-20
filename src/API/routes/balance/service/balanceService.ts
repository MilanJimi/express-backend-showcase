import { DB } from '@db/database'
import { UserFacingError } from '@utils/error'
import { injectable } from 'tsyringe'

import { Denomination, ErrorCode } from '../../../../enums'
import { BalanceRequest } from '../../../validators/balanceValidator'

type CheckEnoughBalanceParams = {
  username: string
  denomination: Denomination
  adjustment: number
}

@injectable()
export class BalanceService {
  constructor(private db: DB) {}

  /* 
    If we were to wait for bank transfer, we could use a webhook of
    our bank's API to notify us of incoming transfers,
    or add a cron job which would check periodically if unavailable 
  */
  topup = (params: BalanceRequest) => this.db.balance.updateBalance(params)

  withdraw = async ({ username, denomination, amount }: BalanceRequest) => {
    const currentBalance = await this.db.balance.getSingleBalance({
      username,
      denomination
    })
    if (!currentBalance || currentBalance?.available_balance < amount)
      throw new UserFacingError(ErrorCode.insufficientBalance)

    /*
      Send an API call to our bank to send money to customer's bank account
    */
    return await this.db.balance.updateBalance({
      username,
      denomination,
      amount: -amount
    })
  }

  getAll = (username: string) => this.db.balance.getBalances(username)

  checkEnoughBalance = async ({
    username,
    denomination,
    adjustment
  }: CheckEnoughBalanceParams) => {
    const balance = await this.db.balance.getSingleBalance({
      denomination,
      username
    })
    if (!balance || adjustment > balance.available_balance)
      throw new UserFacingError(ErrorCode.insufficientBalance)
  }
}
