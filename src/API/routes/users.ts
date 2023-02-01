import bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken'

import { config } from '../../config/config'
import { getUserFromDb, saveUserToDb } from '../../db/requests/user'
import { log } from '../../logging/logger'
import { authenticate } from '../middleware/authenticate'
import { validateUser } from '../validators/userValidator'

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

userRouter.post('/login', async (req, res) => {
  const { error, value } = validateUser.login(req.body)

  if (error) return res.status(400).send(error)
  try {
    const { username, password } = value
    const dbUsers = await getUserFromDb(value.username)
    if (dbUsers.length !== 1) return res.sendStatus(401)

    if (await bcrypt.compare(password, dbUsers[0].password)) {
      const accessToken = jwt.sign(username, config.accessTokenSecret)
      return res.json({ accessToken })
    }
    return res.sendStatus(500)
  } catch (e: unknown) {
    if (e instanceof Error) log('error', e.message)
    return res.sendStatus(401)
  }
})

userRouter.use(authenticate)

export { userRouter }
