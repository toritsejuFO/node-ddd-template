import { Request, Response, Express } from 'express'
import { AwilixContainer } from 'awilix'

const USER_CONTROLLER = 'userController'
const AUTH_CONTROLLER = 'authController'

export default class Router {
  routeLogger: any
  errorHandler: any
  invalidRouteHandler: any
  authGuard: any

  constructor(
    routeLogger: any,
    errorHandler: any,
    invalidRouteHandler: any,
    authGuard: any
  ) {
    this.routeLogger = routeLogger
    this.errorHandler = errorHandler
    this.invalidRouteHandler = invalidRouteHandler
    this.authGuard = authGuard
  }

  setupRoutes(server: Express, container: AwilixContainer) {
    server.use((req, res, next) => {
      req.scope = container.createScope()
      next()
    })
    server.use(this.routeLogger)

    // User routes
    server.get(
      '/users',
      // this.authGuard,
      container.resolve(USER_CONTROLLER).getAllUsers
    )
    server.post(
      '/user/create',
      this.authGuard,
      container.resolve(USER_CONTROLLER).createANewUser
    )
    server.post(
      '/user/register',
      this.authGuard,
      container.resolve(USER_CONTROLLER).getCurrentUser
    )
    server.post(
      '/user/:userId',
      this.authGuard,
      container.resolve(USER_CONTROLLER).getUserById
    )

    // Auth routes
    server.post('/login', container.resolve(AUTH_CONTROLLER).login)
    server.use(this.invalidRouteHandler)
    server.use(this.errorHandler)
  }
}
