import { catchExceptions } from '@api/utils/errorHandler'
import express from 'express'
import { container } from 'tsyringe'

import { authenticate } from '../../middleware/authenticate'
import { swgRegister, swgLogin } from './handlers/swagger'
import { UserHandler } from './handlers/userHandler'

export const swgUsersRouter = {
  '/users/register': swgRegister,
  '/users/login': swgLogin
}

const userRouter = express()
const handler = container.resolve(UserHandler)

userRouter.post('/register', catchExceptions(handler.register))
userRouter.post('/login', catchExceptions(handler.login))
userRouter.use(authenticate)

export { userRouter }
