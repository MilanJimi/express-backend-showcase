import express from 'express'

import { authenticate } from '../../middleware/authenticate'
import { catchExceptions } from '../../utils/errorHandler'
import { handleLogin, swgLogin } from './handlers/login'
import { handleRegister, swgRegister } from './handlers/register'

export const swgUsersRouter = {
  '/users/register': swgRegister,
  '/users/login': swgLogin
}

const userRouter = express()

userRouter.post('/register', catchExceptions(handleRegister))
userRouter.post('/login', catchExceptions(handleLogin))
userRouter.use(authenticate)

export { userRouter }
