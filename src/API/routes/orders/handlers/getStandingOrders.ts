import { Request, Response } from 'express'

import {
  Denomination,
  getSingleStandingOrderFromDb,
  getStandingOrdersFromDb,
  OrderStatus
} from '../../../../db/requests/orders'
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
  const orders = await getStandingOrdersFromDb(pagination, {
    id,
    username,
    status,
    buyDenomination,
    sellDenomination
  })
  res.send(orders)
}

export const handleGetOrderById = async (req: Request, res: Response) =>
  res.send(await getSingleStandingOrderFromDb({ id: req.params.id }))
