import {
  getSingleBalanceFromDb,
  upsertBalanceToDb
} from '../../../db/requests/balance'
import { BalanceRequest } from '../../validators/balanceValidator'

const updateBalance = async ({
  username,
  denomination,
  amount
}: BalanceRequest) => {
  const currentBalance =
    (
      await getSingleBalanceFromDb({
        username,
        denomination
      })
    )?.balance ?? 0

  const newBalance = currentBalance + amount

  return (await upsertBalanceToDb(username, denomination, newBalance))[0]
}

/* 
    If we were to wait for bank transfer, we could use a webhook of
    our bank's API to notify us of incoming transfers,
    or add a cron job which would check periodically if unavailable 
  */
export const topup = (params: BalanceRequest) => updateBalance(params)

export const withdraw = async ({
  username,
  denomination,
  amount
}: BalanceRequest) => {
  const currentBalance = await getSingleBalanceFromDb({
    username,
    denomination
  })
  if (!currentBalance || currentBalance?.balance < amount)
    throw Error('ERROR_INSUFFICIENT_BALANCE')

  /*
    Send an API call to our bank to send money to customer's bank account
  */
  return await updateBalance({ username, denomination, amount: -amount })
}
