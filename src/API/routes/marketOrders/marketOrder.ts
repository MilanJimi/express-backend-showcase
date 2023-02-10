import express from 'express'

import { authenticate } from '../../middleware/authenticate'
import { catchExceptions } from '../../utils/errorHandler'
import { handleNewMarketOrder } from './handlers/newMarketOrder'

const marketOrderRouter = express()
marketOrderRouter.use(authenticate)

marketOrderRouter.post('/new', catchExceptions(handleNewMarketOrder))

export { marketOrderRouter }
