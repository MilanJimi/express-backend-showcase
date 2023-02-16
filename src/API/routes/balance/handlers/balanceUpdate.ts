import { db } from '@db/database'
import { UserFacingError } from '@utils/error'

import { ErrorCode } from '../../../../enums'
import { BalanceRequest } from '../../../validators/balanceValidator'

/* 
    If we were to wait for bank transfer, we could use a webhook of
    our bank's API to notify us of incoming transfers,
    or add a cron job which would check periodically if unavailable 
  */
export const topup = (params: BalanceRequest) => db.updateBalance(params)

export const withdraw = async ({
  username,
  denomination,
  amount
}: BalanceRequest) => {
  const currentBalance = await db.getSingleBalance({
    username,
    denomination
  })
  if (!currentBalance || currentBalance?.available_balance < amount)
    throw new UserFacingError(ErrorCode.insufficientBalance)

  /*
    Send an API call to our bank to send money to customer's bank account
  */
  return await db.updateBalance({ username, denomination, amount: -amount })
}
