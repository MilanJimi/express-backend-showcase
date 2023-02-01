import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { config } from '../../../../config/config'
import { getUserFromDb } from '../../../../db/requests/user'
import { validateUser } from '../../../validators/userValidator'

export const handleLogin = async (req: Request, res: Response) => {
  const { error, value } = validateUser.login(req.body)
  if (error) return res.status(400).send(error)

  const { username, password } = value

  const dbUsers = await getUserFromDb(value.username)
  if (dbUsers.length !== 1) return res.sendStatus(401)

  if (await bcrypt.compare(password, dbUsers[0].password)) {
    const accessToken = jwt.sign(username, config.accessTokenSecret)
    return res.json({ accessToken })
  }
  return res.sendStatus(401)
}
