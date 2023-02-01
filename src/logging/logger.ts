import { Request, Response } from 'express'
import winston from 'winston'
import { redactFields } from './redact'

const { combine, timestamp, printf, colorize, splat } = winston.format

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    colorize(),
    splat(),
    printf(
      ({
        error,
        timestamp,
        level,
        message
      }: winston.Logform.TransformableInfo) => {
        if (error) {
          if (error.stack)
            return `[${timestamp}] ${level}: ${message} :\n${error.stack}`
          return `[${timestamp}] ${level}: ${message} : ${error.toString()}`
        }
        return `[${timestamp}] ${level}: ${message}`
      }
    )
  ),
  transports: [new winston.transports.Console()]
})

export const log = (level: string, message: string, attachments?: unknown) => {
  logger.log(level, message, attachments)
}

export const logRequest = (req: Request, _: Response, next: () => unknown) => {
  const bodyString = Object.keys(req.body).length > 0 ? ' with body %o' : ''
  logger.info(
    `Received request ${req.method}: ${req.originalUrl}${bodyString}`,
    redactFields(req.body)
  )
  next()
}
