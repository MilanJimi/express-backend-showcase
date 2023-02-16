import { NextFunction, Request, Response } from 'express'

import { ErrorCode } from '../../enums'
import { log } from '../../logging/logger'
import { UserFacingError } from '../../utils/error'

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
      if (error instanceof Error) log('error', error.message)
      if (error instanceof UserFacingError)
        return res
          .status(error.code ?? 500)
          .send({ error: error.userFacingMessage })
      return res.status(500).send({ error: ErrorCode.unknown })
    }
  }
