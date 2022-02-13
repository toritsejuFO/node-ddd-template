const { Router } = require('express')

const controller = require('./controller')

module.exports = ({
  errorHandler,
  invalidRouteHandler,
  routeLogger,
  authGuard,
  userManagementService
}) => {
  const router = Router()

  router.use(routeLogger)
  router.use(controller('userController', { authGuard, userManagementService }))
  router.use(controller('authController', { authGuard }))
  router.use(invalidRouteHandler)
  router.use(errorHandler)

  return router
}
