const { Router } = require('express')
const { StatusCodes } = require('http-status-codes')

const container = require('../../../container')
const { isOfType } = require('../../../shared/exceptions')

class AuthController {
  constructor() {
    const router = Router()
    router.post('/auth/login', this.login)
    return router
  }

  login(req, res, next) {
    const { authManagementService } = container.cradle
    const loginParams = req.body

    return authManagementService
      .login(loginParams)
      .then((token) => {
        return res
          .status(StatusCodes.OK)
          .send({ success: true, data: { token } })
      })
      .catch((error) => {
        if (isOfType(error, 'ValidationError')) {
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

module.exports = AuthController
