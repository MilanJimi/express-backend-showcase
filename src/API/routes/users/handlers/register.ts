import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import joiToSwagger from 'joi-to-swagger'

import { db } from '../../../../db/database'
import { validateUser } from '../../../validators/userValidator'

export const swgRegister = {
  post: {
    summary: 'Register a new user',
    tags: ['User'],
    requestBody: {
      content: {
        'application/json': {
          schema: joiToSwagger(validateUser.new).swagger
        }
      }
    },
    responses: {
      '200': {
        description: 'Success message'
      }
    }
  }
}

export const handleRegister = async (req: Request, res: Response) => {
  const { error, value } = validateUser.new.validate(req.body)
  if (error) return res.status(400).send(error)
  if ((await db.getUser(value.username)).length > 0)
    return res.status(409).send(`User "${value.username}" already registered`)

  const passwordHash = await bcrypt.hash(value.password, 10)
  await db.saveUser(value.username, passwordHash)

  return res.send(`Created User ${value.username}`)
}
