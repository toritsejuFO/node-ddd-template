import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import UserManager from '@/app/services/interface/UserManager.interface'
import BaseController from '@presentation/http/controllers/BaseController'
import {
  NewUserSchema,
  LoginSchema,
  ActivateAccountSchema
} from '@presentation/http/schema/UserSchema'
import { Logger } from '@/shared/logger'

const { CREATED, OK, UNAUTHORIZED, BAD_REQUEST, NOT_FOUND } = StatusCodes

export default class UserController extends BaseController {
  constructor(
    private readonly userManager: UserManager,
    protected readonly logger: Logger
  ) {
    super(logger)

    this.logger = logger

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
      return res.status(OK).json(this.success(result))
    } catch (error) {
      console.log('ERROR', error)
      return this.handleError(error, res, next, this.logger)
    }
  }

  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = NewUserSchema.parse(req.body)
      const result = await this.userManager.registerUser(schema)

      if (result.isFail()) {
        return res.status(BAD_REQUEST).json(this.fail(result))
      }

      return res.status(CREATED).json(this.success(result))
    } catch (error) {
      return this.handleError(error, res, next, this.logger)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = LoginSchema.parse(req.body)
      const result = await this.userManager.login(schema)

      if (result.isFail()) {
        return res.status(UNAUTHORIZED).json(this.fail(result))
      }

      return res.status(OK).send(this.success(result))
    } catch (error) {
      return this.handleError(error, res, next, this.logger)
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    const result = await this.userManager.getCurrentUser(req.user)
    return res.status(OK).send(this.success(result))
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const result = await this.userManager.getUserById(id)

      if (result.isFail()) {
        return res.status(NOT_FOUND).json(this.fail(result))
      }

      return res.status(OK).json(this.success(result))
    } catch (error) {
      return this.handleError(error, res, next, this.logger)
    }
  }

  async activateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = ActivateAccountSchema.parse(req.query)
      const result = await this.userManager.activateAccount(schema)

      if (result.isFail()) {
        return res.status(BAD_REQUEST).json(this.fail(result))
      }

      return res.status(OK).json(this.success(result))
    } catch (error) {
      return this.handleError(error, res, next, this.logger)
    }
  }
}
