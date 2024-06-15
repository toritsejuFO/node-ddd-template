import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import UserManager from '../../../app/services/api/UserManager.interface'
import BaseController from './BaseController'
import {
  UserSchema,
  LoginSchema,
  ActivateAccountSchema
} from '../schema/UserSchema'

export default class UserController extends BaseController {
  constructor(private readonly userManager: UserManager) {
    super()

    this.getAllUsers = this.getAllUsers.bind(this)
    this.registerUser = this.registerUser.bind(this)
    this.getCurrentUser = this.getCurrentUser.bind(this)
    this.getUserById = this.getUserById.bind(this)
    this.login = this.login.bind(this)
    this.activateUser = this.activateUser.bind(this)
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userManager.getAllUsers()

      return res
        .status(StatusCodes.OK)
        .json({ success: true, data: result.value() })
    } catch (error) {
      console.log('ERROR', error)
      return this.handleError(error, res, next)
    }
  }

  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = UserSchema.parse(req.body)
      const result = await this.userManager.registerUser(schema)

      if (result.isFail()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: result.error(),
          error: result.metaData()
        })
      }

      return res
        .status(StatusCodes.CREATED)
        .json({ success: true, data: result.value() })
    } catch (error) {
      return this.handleError(error, res, next)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = LoginSchema.parse(req.body)
      const result = await this.userManager.login(schema)

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

  getCurrentUser(req: Request, res: Response, next: NextFunction) {
    return res.status(StatusCodes.OK).send({ success: true, data: req.user })
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const result = await this.userManager.getUserById(id)

      if (result.isFail()) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ success: false, message: result.error() })
      }

      return res
        .status(StatusCodes.OK)
        .json({ success: true, data: result.value() })
    } catch (error) {
      return this.handleError(error, res, next)
    }
  }

  async activateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = ActivateAccountSchema.parse(req.query)
      const result = await this.userManager.activateAccount(schema)

      if (result.isFail()) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ success: false, message: result.error() })
      }

      return res
        .status(StatusCodes.OK)
        .json({ success: true, message: result.value() })
    } catch (error) {
      return this.handleError(error, res, next)
    }
  }
}
