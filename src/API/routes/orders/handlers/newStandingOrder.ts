import { Request, Response } from 'express'
import { db } from '../../../../db/dbConnector'

import { putMoneyOnHoldDB } from '../../../../db/requests/balance'
import { insertStandingOrderDB } from '../../../../db/requests/orders'
import {
  validateOrder
} from '../../../validators/orderValidator'
import { StandingOrderRequest } from "../../../validators/types"

const newStandingOrder = async (params: StandingOrderRequest) =>
  db.transaction(async (trx) => {
    await putMoneyOnHoldDB(trx, {
      username: params.username,
      amount: params.amount,
      denomination: params.sellDenomination
    })
    const response = await insertStandingOrderDB(trx, params)
    return response
  })

export const handleNewStandingOrder = async (req: Request, res: Response) => {
  const { error, value } = validateOrder.newStandingOrder(req.body)
  if (error) return res.sendStatus(400)

  const response = await newStandingOrder(value)
  return res.send(response)
}
