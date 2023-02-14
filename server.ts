import dotenv from 'dotenv'
dotenv.config()
import swaggerUi from 'swagger-ui-express'
import express, { json } from 'express'
import { log, logRequest, logResponse } from './src/logging/logger'
import { userRouter } from './src/API/routes/users/users'
import { balanceRouter } from './src/API/routes/balance/balance'
import { standingOrderRouter } from './src/API/routes/standingOrders/standingOrder'
import { marketOrderRouter } from './src/API/routes/marketOrders/marketOrder'
import { swaggerSpecs } from './docs/swagger.def'

const app = express()
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

app.use(json(), logRequest, logResponse)

app.use('/users', userRouter)
app.use('/balance', balanceRouter)
app.use('/standingOrders', standingOrderRouter)
app.use('/marketOrders', marketOrderRouter)

log('info', `Server started on port ${3000}`)
app.listen(3000)
