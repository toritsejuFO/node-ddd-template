import { Request, Response, NextFunction } from 'express'
import { Logger } from '../../../shared/logger'

export default (logger: Logger) =>
  (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} - ${req.path}`)
    next()
  }
