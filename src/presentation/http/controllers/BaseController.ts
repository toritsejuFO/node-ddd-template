import { NextFunction, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'

export default abstract class BaseController {
  handleError(error: any, res: Response, next: NextFunction) {
    if (error instanceof ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        message: 'Validation error',
        error: error.errors
      })
    }

    return next(error)
  }
}
