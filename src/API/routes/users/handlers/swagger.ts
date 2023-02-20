import { swgAuthTokenSchema } from '@api/validators/schemas/swagger'
import joiToSwagger from 'joi-to-swagger'

import { validateUser } from '../../../validators/userValidator'

export const swgRegister = {
  post: {
    summary: 'Register a new user',
    tags: ['User'],
    requestBody: {
      content: {
        'application/json': {
          schema: joiToSwagger(validateUser.new).swagger
        }
      }
    },
    responses: {
      '200': {
        description: 'Success message'
      }
    }
  }
}

export const swgLogin = {
  post: {
    summary: 'Login',
    tags: ['User'],
    requestBody: {
      content: {
        'application/json': {
          schema: joiToSwagger(validateUser.login).swagger
        }
      }
    },
    responses: {
      '200': {
        description: 'Success message',
        content: swgAuthTokenSchema
      }
    }
  }
}
