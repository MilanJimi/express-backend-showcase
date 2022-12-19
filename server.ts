import dotenv from 'dotenv'
dotenv.config()
import express, { json } from 'express'
import { log, logRequest } from './src/logger'
import { userRouter } from './src/routes/users'

const app = express()

app.set('view engine', 'ejs')
app.use(json(), logRequest)

app.get('/', (req, res) => {
  res.render('index', { text: 'Hello' })
})

app.use('/users', userRouter)

log('info', `Server started on port ${3000}`)
app.listen(3000)
