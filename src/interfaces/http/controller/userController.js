const { Router } = require('express')
const {
  StatusCodes: { OK, CREATED, BAD_REQUEST }
} = require('http-status-codes')

const container = require('../../../container')
const { isOfType } = require('../../../shared/errors')

// Error
VALIDATION_ERROR = 'ValidationError'

class UserController {
  constructor({ userManagementService, authGuard }) {
    this.userManagementService = userManagementService

    const router = Router()
    router.get('/users', authGuard, this.getAllUsers.bind(this))
    router.post('/user/create', authGuard, this.createANewUser.bind(this))
    return router
  }

  getAllUsers(req, res, next) {
    return this.userManagementService
      .getAllUsers()
      .then((users) => {
        return res.status(OK).json({ success: true, data: users })
      })
      .catch((error) => next(error))
  }

  createANewUser(req, res, next) {
    const newUserParams = req.body

    return this.userManagementService
      .createANewUser(newUserParams)
      .then((user) => {
        return res.status(CREATED).json({ success: true, data: user })
      })
      .catch((error) => {
        if (isOfType(error, VALIDATION_ERROR)) {
          return res.status(BAD_REQUEST).json({
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
