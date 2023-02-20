import { catchExceptions } from '@api/utils/errorHandler'
import express from 'express'
import { container } from 'tsyringe'

import { authenticate } from '../../middleware/authenticate'
import { StandingOrderHandler } from './handlers/standingOrderHandler'
import {
  swgFulfillStandingOrder,
  swgGetSingleStandingOrder,
  swgGetStandingOrders,
  swgNewStandingOrder,
  swgUpdateStandingOrder
} from './handlers/swagger'

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
const handler = container.resolve(StandingOrderHandler)

standingOrderRouter.get('/', catchExceptions(handler.getFilteredOrders))
standingOrderRouter.post('/new', catchExceptions(handler.newOrder))
standingOrderRouter.get('/:id', catchExceptions(handler.getOrderById))
standingOrderRouter.post('/:id', catchExceptions(handler.fulfillOrder))
standingOrderRouter.put('/:id', catchExceptions(handler.updateStandingOrder))

export { standingOrderRouter }
