import { Application } from 'express'
import { AwilixContainer } from 'awilix'

const USER_CONTROLLER = 'userController'

export default class Router {
  constructor(
    private readonly routeLogger: any,
    private readonly errorHandler: any,
    private readonly invalidRouteHandler: any,
    private readonly authGuard: any
  ) {}

  setupRoutes(app: Application, container: AwilixContainer) {
    app.use(this.routeLogger)

    // User routes
    app.get(
      '/users',
      this.authGuard,
      container.resolve(USER_CONTROLLER).getAllUsers
    )
    app.post('/user/register', container.resolve(USER_CONTROLLER).registerUser)
    app.post('/user/login', container.resolve(USER_CONTROLLER).login)
    app.get(
      '/user/me',
      this.authGuard,
      container.resolve(USER_CONTROLLER).getCurrentUser
    )
    app.get('/user/activate', container.resolve(USER_CONTROLLER).activateUser)
    app.get(
      '/user/:id',
      this.authGuard,
      container.resolve(USER_CONTROLLER).getUserById
    )

    app.use(this.invalidRouteHandler)
    app.use(this.errorHandler)
  }
}
