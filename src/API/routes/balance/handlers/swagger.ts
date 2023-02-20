import { balanceSchema } from '@api/validators/schemas/balanceSchemas'
import joiToSwagger from 'joi-to-swagger'

import { Denomination } from '../../../../enums'
import { validateBalance } from '../../../validators/balanceValidator'
import { swgOkMessageSchema } from '../../../validators/schemas/swagger'

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
