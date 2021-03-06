const { createContainer, asValue, asFunction, asClass } = require('awilix')

const App = require('./app')
const Config = require('../config')
const Database = require('./infra/database')
const Logger = require('./infra/logger')
const Repository = require('./infra/repository')
const Router = require('./interfaces/http/router')
const Server = require('./interfaces/http/server')
const Encryption = require('./infra/encryption')
const MailProvider = require('./infra/mail/mailProvider')
const JWT = require('./infra/jwt')

// Management Classes
const { UserManagementService } = require('./app/user')
const { AuthManagementService } = require('./app/auth')

// Middlewares
const {
  errorHandler,
  invalidRouteHandler,
  routeLogger,
  authGuard
} = require('./interfaces/http/middleware')

// Events/Event Subscribers
const Subscribers = require('./domain/events/subscribers')
const EVENTS = require('./domain/events/events')
const EventEmitter = require('./infra/events/EventEmitter')

const container = createContainer()

container.register({
  app: asClass(App).singleton(),
  config: asValue(Config),
  database: asFunction(Database).singleton(),
  logger: asFunction(Logger),
  repository: asFunction(Repository).singleton(),
  router: asFunction(Router).singleton(),
  server: asClass(Server).singleton(),
  encryptionService: asClass(Encryption).singleton(),
  jwtService: asClass(JWT).singleton(),
  mailProvider: asClass(MailProvider).singleton(),

  // Operation Services
  userManagementService: asClass(UserManagementService).singleton(),
  authManagementService: asClass(AuthManagementService).singleton(),

  // Middlewares
  errorHandler: asFunction(errorHandler).singleton(),
  invalidRouteHandler: asFunction(invalidRouteHandler).singleton(),
  routeLogger: asFunction(routeLogger).singleton(),
  authGuard: asFunction(authGuard).singleton(),

  // Events/Event Subscribers
  subscribers: asFunction(Subscribers).singleton(),
  EVENTS: asValue(EVENTS),
  eventEmitter: asClass(EventEmitter).singleton()

  // Domain Services
})

module.exports = container
