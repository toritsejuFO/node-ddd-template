const { Router } = require('express')

const container = require('../../../container')

class UserController {
  constructor() {
    const router = Router()
    router.get('/users', this.getAllUsers)
    return router
  }

  getAllUsers(req, res, next) {
    const { userManagementService, logger } = container.cradle

    return userManagementService
      .getAllUsers()
      .then((users) => {
        return res.status(200).json({ success: true, data: users })
      })
      .catch((error) => {
        logger.error(error)
        next(error)
      })
  }
}

module.exports = UserController
