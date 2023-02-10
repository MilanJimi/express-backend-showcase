import { Request, Response } from 'express'

import {
  getSingleStandingOrderDB,
  getStandingOrdersDB
} from '../../../../db/requests/standingOrders'
import { OrderStatus, Denomination } from '../../../../db/requests/types'
import { getPagination } from '../../../utils/pagination'

type QueryParams = Partial<{
  perPage: number
  page: number
  username: string
  id: string
  status: OrderStatus
  buyDenomination: Denomination
  sellDenomination: Denomination
}>

export const handleGetFilteredOrders = async (
  req: Request<unknown, unknown, unknown, QueryParams>,
  res: Response
) => {
  const {
    id,
    username,
    status,
    buyDenomination,
    sellDenomination,
    perPage,
    page
  } = req.query
  const pagination = getPagination(perPage, page)
  const orders = await getStandingOrdersDB({
    id,
    username,
    status,
    buyDenomination,
    sellDenomination,
    ...pagination
  })
  res.send(orders)
}

export const handleGetOrderById = async (req: Request, res: Response) =>
  res.send(await getSingleStandingOrderDB({ id: req.params.id }))
