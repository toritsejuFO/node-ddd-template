import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import AuthManager from '../../../app/services/api/AuthManager.interface'
import { LoginSchema } from '../schema/AuthSchema'
import BaseController from './BaseController'

export default class AuthController extends BaseController {
  constructor(private readonly authManager: AuthManager) {
    super()
    this.login = this.login.bind(this)
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = LoginSchema.parse(req.body)

      const result = await this.authManager.login(schema)

      if (result.isFail()) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ success: false, message: result.error() })
      }

      return res
        .status(StatusCodes.OK)
        .send({ success: true, data: { token: result.value() } })
    } catch (error) {
      return this.handleError(error, res, next)
    }
  }
}
