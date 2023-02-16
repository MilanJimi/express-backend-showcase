import { MarketOrderRequest } from '@api/validators/types'
import { Knex } from 'knex'

import { MarketOrder } from './types'

const insertMarketOrder = async (
  trx: Knex.Transaction,
  { username, sellDenomination, buyDenomination, amount }: MarketOrderRequest,
  rate: number
) =>
  (
    await trx('public.market_orders')
      .insert({
        username,
        buy_denomination: buyDenomination,
        sell_denomination: sellDenomination,
        rate,
        amount
      })
      .returning<MarketOrder[]>('id')
  )[0]

export const marketOrderDbQueries = {
  insertMarketOrder
}
