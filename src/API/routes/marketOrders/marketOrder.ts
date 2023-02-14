import express from 'express'

import { authenticate } from '../../middleware/authenticate'
import { catchExceptions } from '../../utils/errorHandler'
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
