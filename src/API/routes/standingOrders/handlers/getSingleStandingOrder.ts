import { db } from '@db/database'
import { Request, Response } from 'express'

import { swgStandingOrderSchema } from '../../../validators/schemas/swagger'

export const swgGetSingleStandingOrder = {
  get: {
    summary: 'Get single order by ID',
    tags: ['Standing Orders'],
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }
    ],
    responses: {
      '200': {
        description: 'Order',
        content: swgStandingOrderSchema
      }
    }
  }
}

export const handleGetOrderById = async (req: Request, res: Response) =>
  res.send(await db.getSingleStandingOrder({ id: req.params.id }))
