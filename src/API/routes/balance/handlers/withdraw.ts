import { Request, Response } from 'express'
import joiToSwagger from 'joi-to-swagger'
import { Denomination } from '../../../../enums'

import { validateBalance } from '../../../validators/balanceValidator'
import { swgOkMessageSchema } from '../../../validators/schemas/swagger'
import { withdraw } from './balanceUpdate'

export const swgWithdraw = {
  post: {
    summary: 'Withdraw balance of a denomination',
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
          schema: joiToSwagger(validateBalance.withdraw).swagger
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
export const handleWithdraw = async (req: Request, res: Response) => {
  const { error, value } = validateBalance.withdraw.validate({
    ...req.body,
    denomination: req.params.denomination
  })
  if (error) return res.sendStatus(400)

  const newBalance = await withdraw(value)
  return res.send({ message: 'OK', ...newBalance })
}
