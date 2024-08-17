import { NextFunction, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'

import { formatZodError } from '../schema/ZodHelper'
import { Result } from 'types-ddd'
import { Logger } from '@/shared/logger'

type ErrorResponse = {
  success: boolean
  message?: string
  errors?: any
}

type OkResponse = {
  success: boolean
  message?: string
  data?: any
}

export default abstract class BaseController {
  constructor(protected logger: Logger) {}

  handleError(error: any, res: Response, next: NextFunction, logger: Logger) {
    logger.error('ERROR', error)

    if (error instanceof ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        message: 'Schema validation error',
        errors: formatZodError(error)
      })
    }

    return next(error)
  }

  fail(result: Result<any, any, any>) {
    const response: ErrorResponse = {
      success: false,
      message: result.error()
    }
    return response
  }

  success(result: Result<any, any, any>) {
    const response: OkResponse = { success: true }

    if (typeof result.value() === 'string') {
      response.message = result.value()
    } else {
      response.data = result.value()
      response.message = result.metaData()
    }
    return response
  }
}
