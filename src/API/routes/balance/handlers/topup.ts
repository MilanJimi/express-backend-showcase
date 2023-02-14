import { Request, Response } from 'express'
import joiToSwagger from 'joi-to-swagger'
import { Denomination } from '../../../../enums'
import { validateBalance } from '../../../validators/balanceValidator'
import { swgOkMessageSchema } from '../../../validators/schemas/swagger'
import { topup } from './balanceUpdate'

export const swgTopup = {
  post: {
    summary: 'Increase balance of a denomination',
    tags: ['Balance'],
    parameters: [
      {
        name: 'denomination',
        in: 'path',
        required: true,
        schema: { type: 'string', enum: Object.values(Denomination) }
      }
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: joiToSwagger(validateBalance.topup).swagger
        }
      }
    },
    responses: {
      '200': {
        description: 'Success message',
        content: swgOkMessageSchema
      }
    }
  }
}

export const handleTopup = async (req: Request, res: Response) => {
  const { error, value } = validateBalance.topup.validate({
    ...req.body,
    denomination: req.params.denomination
  })
  if (error) return res.sendStatus(400)

  await topup(value)

  return res.send({ message: 'OK' })
}
