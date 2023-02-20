import { Request, Response } from 'express'
import joiToSwagger from 'joi-to-swagger'

import { ErrorCode } from '../../../../enums'
import { validateMarketOrder } from '../../../validators/marketOrderValidator'
import {
  swgOkMessageSchema,
  userFacingErrorSchema
} from '../../../validators/schemas/swagger'
import { MarketOrderService } from '../service/marketOrderService'

export const swgNewMarketOrder = {
  post: {
    summary: 'New market order',
    tags: ['Market Orders'],
    requestBody: {
      content: {
        'application/json': {
          schema: joiToSwagger(validateMarketOrder.new).swagger
        }
      }
    },
    responses: {
      '200': {
        description: 'Success message',
        content: swgOkMessageSchema
      },
      '500': {
        description: 'Error',
        content: userFacingErrorSchema([ErrorCode.insufficientBalance])
      }
    }
  }
}

export class MarketOrderHandler {
  constructor(private service: MarketOrderService) {}
  newOrder = async (req: Request, res: Response) => {
    const { error, value } = validateMarketOrder.new.validate(req.body)
    if (error) return res.sendStatus(400)

    await this.service.newOrder(value)
    return res.send({ message: 'OK' })
  }
}
