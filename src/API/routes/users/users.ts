import express from 'express'

import { authenticate } from '../../middleware/authenticate'
import { catchExceptions } from '../../utils/errorHandler'
import { handleLogin } from './handlers/login'
import { handleRegister } from './handlers/register'

const userRouter = express()

userRouter.post('/register', catchExceptions(handleRegister))
userRouter.post('/login', catchExceptions(handleLogin))
userRouter.use(authenticate)

export { userRouter }
