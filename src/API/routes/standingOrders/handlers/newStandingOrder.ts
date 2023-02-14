import { Request, Response } from 'express'
import joiToSwagger from 'joi-to-swagger'

import { ErrorCode } from '../../../../enums'
import { automaticFulfillOrder } from '../../../../methods/fulfillment/automaticFulfill'
import { OrderType } from '../../../../methods/fulfillment/types'
import {
  swgAutomaticFulfillmentSchema,
  userFacingErrorSchema
} from '../../../validators/schemas/swagger'
import { validateStandingOrder } from '../../../validators/standingOrderValidator'

export const swgNewStandingOrder = {
  post: {
    summary: 'New standing order',
    tags: ['Standing Orders'],
    requestBody: {
      content: {
        'application/json': {
          schema: joiToSwagger(validateStandingOrder.new).swagger
        }
      }
    },
    responses: {
      '200': {
        description: 'Automatic fulfillment result (if any)',
        content: swgAutomaticFulfillmentSchema
      },
      '500': {
        description: 'Error',
        content: userFacingErrorSchema([ErrorCode.insufficientBalance])
      }
    }
  }
}

export const handleNewStandingOrder = async (req: Request, res: Response) => {
  const { error, value } = validateStandingOrder.new.validate(req.body)
  if (error) return res.sendStatus(400)

  const response = await automaticFulfillOrder({
    ...value,
    type: OrderType.standing
  })
  return res.send(response.automaticFulfillment)
}
