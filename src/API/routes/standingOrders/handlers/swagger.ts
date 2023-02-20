import { validateStandingOrder } from '@api/validators/standingOrderValidator'
import joiToSwagger from 'joi-to-swagger'
import { OrderStatus, Denomination, ErrorCode } from 'src/enums'
import {
  swgAutomaticFulfillmentSchema,
  swgMultipleStandingOrdersSchema,
  swgOkMessageSchema,
  swgStandingOrderSchema,
  userFacingErrorSchema
} from '../../../validators/schemas/swagger'

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

export const swgFulfillStandingOrder = {
  post: {
    summary: 'Fulfill given order up to an amount - if balance is sufficient',
    tags: ['Standing Orders'],
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: joiToSwagger(validateStandingOrder.fulfill).swagger
        }
      }
    },
    responses: {
      '200': {
        description: 'Success message',
        content: swgOkMessageSchema
      },
      '404': {
        description: 'Not Found',
        content: userFacingErrorSchema([ErrorCode.orderNotFound])
      },
      '500': {
        description: 'Error',
        content: userFacingErrorSchema([
          ErrorCode.orderFulfilled,
          ErrorCode.orderSmallerThanAmount,
          ErrorCode.insufficientBalance
        ])
      }
    }
  }
}

export const swgUpdateStandingOrder = {
  put: {
    summary: 'Update own standing order - if balance is sufficient',
    tags: ['Standing Orders'],
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' }
      }
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: joiToSwagger(validateStandingOrder.update).swagger
        }
      }
    },
    responses: {
      '200': {
        description: 'Success message',
        content: swgOkMessageSchema
      },
      '401': { description: 'Unauthorized (if updating not own order)' },
      '404': {
        description: 'Not Found',
        content: userFacingErrorSchema([ErrorCode.orderNotFound])
      },
      '500': {
        description: 'Error',
        content: userFacingErrorSchema([
          ErrorCode.orderFulfilled,
          ErrorCode.orderSmallerThanAmount,
          ErrorCode.insufficientBalance
        ])
      }
    }
  }
}
