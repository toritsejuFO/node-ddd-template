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

    const userController = function () {
      return container.resolve(USER_CONTROLLER)
    }

    // User routes
    app.get('/users', this.authGuard, userController().getAllUsers)
    app.post('/user/register', userController().registerUser)
    app.post('/user/login', userController().login)
    app.get('/user/me', this.authGuard, userController().getCurrentUser)
    app.get('/user/activate', userController().activateUser)
    app.get('/user/:id', this.authGuard, userController().getUserById)

    app.use(this.invalidRouteHandler)
    app.use(this.errorHandler)
  }
}
