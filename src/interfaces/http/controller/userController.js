const { Router } = require('express')
const {
  StatusCodes: { OK, CREATED, BAD_REQUEST, NOT_FOUND }
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
    router.get('/user/me', authGuard, this.getCurrentUser.bind(this))
    router.get('/user/:userId', authGuard, this.getUserById.bind(this))
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

  getCurrentUser(req, res, next) {
    return res.status(OK).send({ success: true, data: req.user.serialize() })
  }

  getUserById(req, res, next) {
    const { userId } = req.params

    this.userManagementService
      .getUserById(userId)
      .then((user) => {
        if (!user) {
          return res
            .status(NOT_FOUND)
            .json({ success: false, message: 'User Not Found' })
        }
        return res.status(OK).json({ success: true, data: user })
      })
      .catch((error) => next(error))
  }
}

module.exports = UserController
