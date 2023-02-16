import { catchExceptions } from '@api/utils/errorHandler'
import express from 'express'

import { authenticate } from '../../middleware/authenticate'
import {
  handleNewMarketOrder,
  swgNewMarketOrder
} from './handlers/newMarketOrder'

export const swgMarketOrderRouter = {
  '/marketOrders/new': swgNewMarketOrder
}
const marketOrderRouter = express()
marketOrderRouter.use(authenticate)

marketOrderRouter.post('/new', catchExceptions(handleNewMarketOrder))

export { marketOrderRouter }
