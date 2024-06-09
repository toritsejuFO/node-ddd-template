const controller = require('./controller')

import {
  authGuard,
  errorHandler,
  invalidRouteHandler,
  routeLogger
} from './middleware'

const USER_CONTROLLER = 'userController'

export default class Router {
  static setupRoutes(server) {
    server.use(routeLogger)

    server.get('/users', authGuard, (req, res) =>
      req.scope.resolve(USER_CONTROLLER).getAllUsers(req, res)
    )
    server.post('/user/create', authGuard, (req, res) =>
      req.scope.resolve(USER_CONTROLLER).createANewUser(req, res)
    )
    server.post('/user/create', authGuard, (req, res) =>
      req.scope.resolve(USER_CONTROLLER).getCurrentUser(req, res)
    )
    server.post('/user/create', authGuard, (req, res) =>
      req.scope.resolve(USER_CONTROLLER).getUserById(req, res)
    )

    server.use(controller('authController', { authGuard }))
    server.use(invalidRouteHandler)
    server.use(errorHandler)
  }
}
