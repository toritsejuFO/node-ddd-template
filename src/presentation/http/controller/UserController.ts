import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

import { isOfType } from '../../../shared/errors/ErrorValidation'
import ValidationError from '../../../shared/errors/ValidationError'
import UserManager from '../../../app/services/api/UserManager.interface'

export default class UserController {
  constructor(private readonly userManager: UserManager) {
    this.getAllUsers = this.getAllUsers.bind(this)
    this.createANewUser = this.createANewUser.bind(this)
    this.getCurrentUser = this.getCurrentUser.bind(this)
    this.getUserById = this.getUserById.bind(this)
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    return this.userManager
      .getAllUsers()
      .then((users) => {
        return res.status(StatusCodes.OK).json({ success: true, data: users })
      })
      .catch((error) => next(error))
  }

  async createANewUser(req: Request, res: Response, next: NextFunction) {
    const newUserParams = req.body

    return this.userManager
      .createANewUser(newUserParams)
      .then((user) => {
        return res
          .status(StatusCodes.CREATED)
          .json({ success: true, data: user })
      })
      .catch((error) => {
        if (isOfType(error, ValidationError.name)) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message,
            error: error.error
          })
        }
        return next(error)
      })
  }

  getCurrentUser(
    req: Request & { user: any },
    res: Response,
    next: NextFunction
  ) {
    return res
      .status(StatusCodes.OK)
      .send({ success: true, data: req.user.serialize() })
  }

  getUserById(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params

    this.userManager
      .getUserById(userId)
      .then((user) => {
        if (!user) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ success: false, message: 'User Not Found' })
        }
        return res.status(StatusCodes.OK).json({ success: true, data: user })
      })
      .catch((error) => next(error))
  }
}
