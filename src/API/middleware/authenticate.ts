import { config } from '@config/config'
import { UserFacingError } from '@utils/error'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { ErrorCode } from '../../enums'

export type AuthenticatedRequest<T = Request> = T & {
  user: string
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new UserFacingError(ErrorCode.unauthorized, 401)

  jwt.verify(token, config.accessTokenSecret, (err, user) => {
    if (err) throw new UserFacingError(ErrorCode.unauthorized, 401)
    req.body.username = user
    return next()
  })
  return
}
