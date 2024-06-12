import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Logger } from '../../../infra/logger'

export default (logger: Logger) =>
  (req: Request, res: Response, next: NextFunction) => {
    const message = `Invalid Route, cannot ${req.method} ${req.path}`
    logger.info('INVALID_ROUTE:', message)
    return res.status(StatusCodes.NOT_FOUND).json({ success: false, message })
  }
