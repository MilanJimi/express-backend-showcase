import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import joiToSwagger from 'joi-to-swagger'
import jwt from 'jsonwebtoken'

import { config } from '../../../../config/config'
import { db } from '../../../../db/database'
import { ErrorCode } from '../../../../enums'
import { UserFacingError } from '../../../utils/error'
import { swgAuthTokenSchema } from '../../../validators/schemas/swagger'
import { validateUser } from '../../../validators/userValidator'

export const swgLogin = {
  post: {
    summary: 'Login',
    tags: ['User'],
    requestBody: {
      content: {
        'application/json': {
          schema: joiToSwagger(validateUser.login).swagger
        }
      }
    },
    responses: {
      '200': {
        description: 'Success message',
        content: swgAuthTokenSchema
      }
    }
  }
}

export const handleLogin = async (req: Request, res: Response) => {
  const { error, value } = validateUser.login.validate(req.body)
  if (error) return res.status(400).send(error)

  const { username, password } = value

  const dbUsers = await db.getUser(value.username)
  if (dbUsers.length !== 1)
    throw new UserFacingError(ErrorCode.unauthorized, 401)

  if (await bcrypt.compare(password, dbUsers[0].password)) {
    const accessToken = jwt.sign(username, config.accessTokenSecret)
    return res.json({ accessToken })
  }
  throw new UserFacingError(ErrorCode.unauthorized, 401)
}
