import swaggerJsDoc from 'swagger-jsdoc'
import { swgBalanceRouter } from '../src/API/routes/balance/balance'
import { swgMarketOrderRouter } from '../src/API/routes/marketOrders/marketOrder'
import { swgStandingOrderRouter } from '../src/API/routes/standingOrders/standingOrder'
import { swgUsersRouter } from '../src/API/routes/users/users'

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Currency Exchange',
      version: '1.0.0',
      description: 'A model currency exchange in Express'
    },
    components: {
      securitySchemes: {
        Authorization: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          value: 'Bearer <JWT token here>'
        }
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server'
      }
    ],
    paths: {
      ...swgUsersRouter,
      ...swgBalanceRouter,
      ...swgStandingOrderRouter,
      ...swgMarketOrderRouter
    }
  },
  apis: ['../src/API/routes/**/*.ts']
}
export const swaggerSpecs = swaggerJsDoc(options)
