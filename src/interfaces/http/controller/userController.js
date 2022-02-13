const { Router } = require('express')
const {
  StatusCodes: { OK, CREATED, BAD_REQUEST }
} = require('http-status-codes')

const container = require('../../../container')
const { isOfType } = require('../../../shared/errors')

// Error
VALIDATION_ERROR = 'ValidationError'

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
        return res.status(OK).json({ success: true, data: users })
      })
      .catch((error) => next(error))
  }

  createANewUser(req, res, next) {
    const { userManagementService } = container.cradle
    const newUserParams = req.body

    return userManagementService
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
