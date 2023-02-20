import { catchExceptions } from '@api/utils/errorHandler'
import express from 'express'
import { container } from 'tsyringe'

import { authenticate } from '../../middleware/authenticate'
import {
  MarketOrderHandler,
  swgNewMarketOrder
} from './handlers/marketOrderHandler'

export const swgMarketOrderRouter = {
  '/marketOrders/new': swgNewMarketOrder
}
const marketOrderRouter = express()
marketOrderRouter.use(authenticate)
const handler = container.resolve(MarketOrderHandler)

marketOrderRouter.post('/new', catchExceptions(handler.newOrder))

export { marketOrderRouter }
