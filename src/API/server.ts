import express, { json } from 'express'
import swaggerUi from 'swagger-ui-express'

import { swaggerSpecs } from '../../docs/swagger.def'
import { logRequest, logResponse } from '../logging/logger'
import { balanceRouter } from './routes/balance/balance'
import { marketOrderRouter } from './routes/marketOrders/marketOrder'
import { standingOrderRouter } from './routes/standingOrders/standingOrder'
import { userRouter } from './routes/users/users'

const app = express()
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

app.use(json(), logRequest, logResponse)

app.use('/users', userRouter)
app.use('/balance', balanceRouter)
app.use('/standingOrders', standingOrderRouter)
app.use('/marketOrders', marketOrderRouter)

export { app }
