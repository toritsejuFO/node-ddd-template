import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { isOfType } from '../../../shared/errors/ErrorValidation'
import ValidationError from '../../../shared/errors/ValidationError'
import IAuthManager from '../../../app/services/api/AuthManager'

export default class AuthController {
  authManager: IAuthManager

  constructor(authManager: IAuthManager) {
    this.authManager = authManager
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const loginParams = req.body

    return this.authManager
      .login(loginParams)
      .then((token) => {
        return res
          .status(StatusCodes.OK)
          .send({ success: true, data: { token } })
      })
      .catch((error) => {
        if (isOfType(error, ValidationError.name)) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            success: false,
            message: error.message,
            error: error.error
          })
        }

        return next(error)
      })
  }
}
