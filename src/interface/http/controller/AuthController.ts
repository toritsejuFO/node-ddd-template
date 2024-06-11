import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { isOfType } from '../../../shared/errors/ErrorValidation'
import ValidationError from '../../../shared/errors/ValidationError'
import AuthManager from '../../../app/services/api/AuthManager'

export default class AuthController {
  authManager: AuthManager

  constructor(authManager: AuthManager) {
    this.authManager = authManager
    this.login = this.login.bind(this)
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
