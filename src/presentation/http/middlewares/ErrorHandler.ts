import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { Logger } from '../../../shared/logger'

export default (logger: Logger) =>
  (error: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    })
  }
