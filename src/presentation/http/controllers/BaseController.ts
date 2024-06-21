import { NextFunction, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'

import { formatZodError } from '../schema/ZodHelper'
import { Result } from 'types-ddd'
import { USER_ALREADY_EXISTS } from '@/app/messaging/UserMessage'

type ErrorResponse = {
  success: boolean
  message: string
  errors?: any
}

export default abstract class BaseController {
  handleError(error: any, res: Response, next: NextFunction) {
    if (error instanceof ZodError) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        success: false,
        message: 'Schema validation error',
        errors: formatZodError(error)
      })
    }

    return next(error)
  }

  evaluateStatusCode(result: Result<any, any, any>) {
    const metaData = result.metaData()
    if (!metaData) return StatusCodes.BAD_REQUEST

    switch (metaData.code) {
      case USER_ALREADY_EXISTS.code:
        return StatusCodes.CONFLICT
      default:
        return StatusCodes.BAD_REQUEST
    }
  }

  fail(result: Result<any, any, any>) {
    const response: ErrorResponse = {
      success: false,
      message: result.error()
    }

    if (result.metaData()) {
      response.errors = result.metaData()
    }

    return response
  }

  success(result: Result<any, any, any>) {
    return {
      success: true,
      data: result.value()
    }
  }
}
