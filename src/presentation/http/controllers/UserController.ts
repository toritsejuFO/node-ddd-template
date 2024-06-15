import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import UserManager from '../../../app/services/api/UserManager.interface'
import BaseController from './BaseController'
import { UserSchema } from '../schema/UserSchema'
import { LoginSchema } from '../schema/AuthSchema'

export default class UserController extends BaseController {
  constructor(private readonly userManager: UserManager) {
    super()

    this.getAllUsers = this.getAllUsers.bind(this)
    this.createANewUser = this.createANewUser.bind(this)
    this.getCurrentUser = this.getCurrentUser.bind(this)
    this.getUserById = this.getUserById.bind(this)
    this.login = this.login.bind(this)
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

  async createANewUser(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = UserSchema.parse(req.body)
      const result = await this.userManager.createANewUser(schema)

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
    const { userId } = req.params

    try {
      const result = await this.userManager.getUserById(userId)

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
}
