import { getPagination } from '@api/utils/pagination'
import { db } from '@db/database'
import { Request, Response } from 'express'

import { Denomination, OrderStatus } from '../../../../enums'
import { swgMultipleStandingOrdersSchema } from '../../../validators/schemas/swagger'

export const swgGetStandingOrders = {
  get: {
    summary: 'Get orders by filter',
    tags: ['Standing Orders'],
    parameters: [
      {
        name: 'id',
        in: 'query',
        required: false,
        schema: { type: 'string' }
      },
      {
        name: 'perPage',
        in: 'query',
        required: false,
        schema: { type: 'number' }
      },
      {
        name: 'page',
        in: 'query',
        required: false,
        schema: { type: 'number' }
      },
      {
        name: 'username',
        in: 'query',
        required: false,
        schema: { type: 'string' }
      },
      {
        name: 'status',
        in: 'query',
        required: false,
        schema: { type: 'string', enum: Object.values(OrderStatus) }
      },
      {
        name: 'buyDenomination',
        in: 'query',
        required: false,
        schema: { type: 'string', enum: Object.values(Denomination) }
      },
      {
        name: 'sellDenomination',
        in: 'query',
        required: false,
        schema: { type: 'string', enum: Object.values(Denomination) }
      }
    ],
    responses: {
      '200': {
        description: 'Matching orders',
        content: swgMultipleStandingOrdersSchema
      }
    }
  }
}

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
  const orders = await db.getStandingOrders({
    id,
    username,
    status,
    buyDenomination,
    sellDenomination,
    ...pagination
  })
  res.send(orders)
}
