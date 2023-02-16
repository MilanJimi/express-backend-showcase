import dotenv from 'dotenv'
dotenv.config()
import { app } from './src/API/server'
import { log } from './src/logging/logger'

log('info', `Server started on port ${3000}`)
app.listen(3000)
