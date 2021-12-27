const { createContainer, asValue, asFunction, asClass } = require('awilix')

const App = require('./app')
const Config = require('../config')
const Database = require('./infra/database')
const Logger = require('./infra/logger')
const Repository = require('./infra/repository')
const Router = require('./interfaces/http/router')
const Server = require('./interfaces/http/server')

// Management Classes
const { UserManagementService } = require('./app/user')

// Middlewares
const {
  exceptionHandler,
  invalidRouteHandler,
  routeLogger
} = require('./interfaces/http/middleware')

const container = createContainer()

container.register({
  app: asClass(App).singleton(),
  config: asValue(Config),
  database: asFunction(Database).singleton(),
  logger: asFunction(Logger),
  repository: asFunction(Repository).singleton(),
  router: asFunction(Router).singleton(),
  server: asClass(Server).singleton(),

  // Operation Services
  userManagementService: asClass(UserManagementService).singleton(),

  // Middlewares
  exceptionHandler: asFunction(exceptionHandler).singleton(),
  invalidRouteHandler: asFunction(invalidRouteHandler).singleton(),
  routeLogger: asFunction(routeLogger).singleton()
})

module.exports = container
