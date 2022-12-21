import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../../config/config'

type AuthenticatedRequest<T = Request> = T & {
  user: string
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.sendStatus(409)

  jwt.verify(token, config.accessTokenSecret, (err, user) => {
    if (err) return res.sendStatus(409)
    req = { ...req, user } as AuthenticatedRequest
    return next()
  })
  return
}
