import express from 'express'

import { authenticate } from '../../middleware/authenticate'
import { catchExceptions } from '../../utils/errorHandler'
import {
  handleGetFilteredOrders,
  handleGetOrderById
} from './handlers/getStandingOrders'
import { handleNewStandingOrder } from './handlers/newStandingOrder'

const standingOrderRouter = express()
standingOrderRouter.use(authenticate)

standingOrderRouter.post('/new', catchExceptions(handleNewStandingOrder))
standingOrderRouter.get('/', catchExceptions(handleGetFilteredOrders))
standingOrderRouter.get('/:id', catchExceptions(handleGetOrderById))

export { standingOrderRouter }
