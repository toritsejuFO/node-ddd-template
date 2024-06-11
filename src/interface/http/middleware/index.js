const errorHandler = require('./errorHandler')
const invalidRouteHandler = require('./invalidRouteHandler')
const routeLogger = require('./routeLogger')
const authGuard = require('./authGuard').default

module.exports = {
  errorHandler,
  invalidRouteHandler,
  routeLogger,
  authGuard
}
