const { Router } = require('express')

const container = require('../../../container')

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
        return res.status(200).send({ success: true, data: token })
      })
      .catch((error) => {
        return res
          .status(400)
          .send({ success: false, message: error.message, error: error.error })
      })
  }
}

module.exports = AuthController
