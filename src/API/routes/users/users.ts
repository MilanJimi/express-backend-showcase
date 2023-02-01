import bcrypt from 'bcrypt'
import express from 'express'

import { getUserFromDb, saveUserToDb } from '../../../db/requests/user'
import { log } from '../../../logging/logger'
import { authenticate } from '../../middleware/authenticate'
import { catchExceptions } from '../../utils/errorHandler'
import { validateUser } from '../../validators/userValidator'
import { login } from './login'

const userRouter = express()

userRouter.post('/register', async (req, res) => {
  const { error, value } = validateUser.new(req.body)
  if (error) return res.status(400).send(error)
  if ((await getUserFromDb(value.username)).length > 0)
    return res.status(409).send(`User "${value.username}" already registered`)

  try {
    const passwordHash = await bcrypt.hash(value.password, 10)
    await saveUserToDb(value.username, passwordHash)
  } catch (e: unknown) {
    if (e instanceof Error) log('error', e.message)
    return res.sendStatus(500)
  }
  return res.send(`Created User ${value.username}`)
})

userRouter.post('/login', catchExceptions(login))

userRouter.use(authenticate)

export { userRouter }
