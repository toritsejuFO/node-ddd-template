const { Router } = require('express')

const controller = require('./controller')

// Middlewares
const exceptionHandler = require('./middleware/exceptionHandler')
const invalidRouteHandler = require('./middleware/invalidRouteHandler')
const routeLogger = require('./middleware/routeLogger')

module.exports = () => {
  const router = Router()

  router.use(routeLogger)
  router.use(controller('userController'))
  router.use(invalidRouteHandler)
  router.use(exceptionHandler)
  return router
}
