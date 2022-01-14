const { Router } = require('express')

const controller = require('./controller')

module.exports = ({ exceptionHandler, invalidRouteHandler, routeLogger }) => {
  const router = Router()

  router.use(routeLogger)
  router.use(controller('userController'))
  router.use(invalidRouteHandler)
  router.use(exceptionHandler)

  return router
}
