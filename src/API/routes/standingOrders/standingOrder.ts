import express from 'express'

import { authenticate } from '../../middleware/authenticate'
import { catchExceptions } from '../../utils/errorHandler'
import {
  handleFulfillOrder,
  swgFulfillStandingOrder
} from './handlers/fulfillStandingOrder'
import {
  handleGetOrderById,
  swgGetSingleStandingOrder
} from './handlers/getSingleStandingOrder'
import {
  handleGetFilteredOrders,
  swgGetStandingOrders
} from './handlers/getStandingOrders'
import {
  handleNewStandingOrder,
  swgNewStandingOrder
} from './handlers/newStandingOrder'
import {
  handleUpdateStandingOrder,
  swgUpdateStandingOrder
} from './handlers/updateStandingOrder'

export const swgStandingOrderRouter = {
  '/standingOrders': swgGetStandingOrders,
  '/standingOrders/new': swgNewStandingOrder,
  '/standingOrders/{id}': {
    ...swgFulfillStandingOrder,
    ...swgUpdateStandingOrder,
    ...swgGetSingleStandingOrder
  }
}

const standingOrderRouter = express()
standingOrderRouter.use(authenticate)

standingOrderRouter.get('/', catchExceptions(handleGetFilteredOrders))
standingOrderRouter.post('/new', catchExceptions(handleNewStandingOrder))
standingOrderRouter.get('/:id', catchExceptions(handleGetOrderById))
standingOrderRouter.post('/:id', catchExceptions(handleFulfillOrder))
standingOrderRouter.put('/:id', catchExceptions(handleUpdateStandingOrder))

export { standingOrderRouter }
