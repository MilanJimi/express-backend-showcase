import { DB } from '@db/database'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

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
  res.send(
    await container
      .resolve(DB)
      .standingOrder.getSingleStandingOrder({ id: req.params.id })
  )
