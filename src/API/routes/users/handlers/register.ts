import bcrypt from 'bcrypt'
import { Request, Response } from 'express'

import { getUserDB, saveUserDB } from '../../../../db/requests/user'
import { validateUser } from '../../../validators/userValidator'

export const handleRegister = async (req: Request, res: Response) => {
  const { error, value } = validateUser.new(req.body)
  if (error) return res.status(400).send(error)
  if ((await getUserDB(value.username)).length > 0)
    return res.status(409).send(`User "${value.username}" already registered`)

  const passwordHash = await bcrypt.hash(value.password, 10)
  await saveUserDB(value.username, passwordHash)

  return res.send(`Created User ${value.username}`)
}
