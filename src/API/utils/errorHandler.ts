import { NextFunction, Request, Response } from 'express'
import { log } from '../../logging/logger'

type PromiseFunction = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<unknown>

export const catchExceptions =
  (handler: PromiseFunction) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await handler(req, res, next)
    } catch (error: unknown) {
      if (error instanceof Error)
        log(
          'error',
          error.message === ''
            ? 'There has been an unknown error'
            : error.message
        )
      return res.sendStatus(500)
    }
  }
