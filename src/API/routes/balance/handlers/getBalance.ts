import { DB } from '@db/database'
import { Request, Response } from 'express'
import joiToSwagger from 'joi-to-swagger'
import { container } from 'tsyringe'

import { balanceSchema } from '../../../validators/schemas/balanceSchemas'

export const swgGetBalance = {
  get: {
    summary: 'Get all balances',
    tags: ['Balance'],
    responses: {
      '200': {
        description: 'Success message',
        content: {
          'application/json': {
            schema: joiToSwagger(balanceSchema).swagger
          }
        }
      }
    }
  }
}

export const handleGetBalance = async (req: Request, res: Response) => {
  const username = req.body.username as string
  const balances = await container.resolve(DB).balance.getBalances(username)
  return res.send(balances)
}
