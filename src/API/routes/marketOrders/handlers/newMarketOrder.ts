import { Request, Response } from 'express'
import joiToSwagger from 'joi-to-swagger'

import { ErrorCode } from '../../../../enums'
import { automaticFulfillOrder } from '../../../../methods/fulfillment/automaticFulfill'
import { OrderType } from '../../../../methods/fulfillment/types'
import { validateMarketOrder } from '../../../validators/marketOrderValidator'
import {
  swgOkMessageSchema,
  userFacingErrorSchema
} from '../../../validators/schemas/swagger'
import { MarketOrderRequest } from '../../../validators/types'

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

const newMarketOrder = async (params: MarketOrderRequest) => {
  await automaticFulfillOrder({ ...params, type: OrderType.market })
}

export const handleNewMarketOrder = async (req: Request, res: Response) => {
  const { error, value } = validateMarketOrder.new.validate(req.body)
  if (error) return res.sendStatus(400)

  await newMarketOrder(value)
  return res.send({ message: 'OK' })
}
