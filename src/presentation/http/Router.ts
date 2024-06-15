import { Express } from 'express'
import { AwilixContainer } from 'awilix'

const USER_CONTROLLER = 'userController'

export default class Router {
  constructor(
    private readonly routeLogger: any,
    private readonly errorHandler: any,
    private readonly invalidRouteHandler: any,
    private readonly authGuard: any
  ) {}

  setupRoutes(server: Express, container: AwilixContainer) {
    server.use(this.routeLogger)

    // User routes
    server.get(
      '/users',
      this.authGuard,
      container.resolve(USER_CONTROLLER).getAllUsers
    )
    server.post(
      '/user/register',
      container.resolve(USER_CONTROLLER).registerUser
    )
    server.post('/user/login', container.resolve(USER_CONTROLLER).login)
    server.get(
      '/user/me',
      this.authGuard,
      container.resolve(USER_CONTROLLER).getCurrentUser
    )
    server.get(
      '/user/activate',
      container.resolve(USER_CONTROLLER).activateUser
    )
    server.get(
      '/user/:id',
      this.authGuard,
      container.resolve(USER_CONTROLLER).getUserById
    )

    server.use(this.invalidRouteHandler)
    server.use(this.errorHandler)
  }
}
