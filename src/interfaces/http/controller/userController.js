const { Router } = require('express')
const { StatusCodes } = require('http-status-codes')

const container = require('../../../container')
const { isOfType } = require('../../../shared/exceptions')

class UserController {
  constructor() {
    const router = Router()
    router.get('/users', this.getAllUsers)
    router.post('/user/create', this.createANewUser)
    return router
  }

  getAllUsers(req, res, next) {
    const { userManagementService } = container.cradle

    return userManagementService
      .getAllUsers()
      .then((users) => {
        return res.status(StatusCodes.OK).json({ success: true, data: users })
      })
      .catch((error) => next(error))
  }

  createANewUser(req, res, next) {
    const { userManagementService } = container.cradle
    const newUserParams = req.body

    return userManagementService
      .createANewUser(newUserParams)
      .then((user) => {
        return res
          .status(StatusCodes.CREATED)
          .json({ success: true, data: user })
      })
      .catch((error) => {
        if (isOfType(error, 'ValidationError')) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message,
            error: error.error
          })
        }
        return next(error)
      })
  }
}

module.exports = UserController
