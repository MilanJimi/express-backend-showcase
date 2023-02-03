import express from 'express'

import { authenticate } from '../../middleware/authenticate'
import { catchExceptions } from '../../utils/errorHandler'
import { handleFulfillOrder } from './handlers/fulfillStandingOrder'
import {
  handleGetFilteredOrders,
  handleGetOrderById
} from './handlers/getStandingOrders'
import { handleNewStandingOrder } from './handlers/newStandingOrder'

const standingOrderRouter = express()
standingOrderRouter.use(authenticate)

standingOrderRouter.get('/', catchExceptions(handleGetFilteredOrders))
standingOrderRouter.post('/new', catchExceptions(handleNewStandingOrder))
standingOrderRouter.get('/:id', catchExceptions(handleGetOrderById))
standingOrderRouter.post('/:id', catchExceptions(handleFulfillOrder))

export { standingOrderRouter }
