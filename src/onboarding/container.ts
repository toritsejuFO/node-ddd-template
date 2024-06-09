const { createContainer, asValue, asFunction, asClass } = require('awilix')

const Config = require('../config')
const Database = require('./infra/database')
const Logger = require('./infra/logger')
const Repository = require('./infra/repository')
import Application from './interfaces/http/Application'
const Encryption = require('./infra/encryption')
const MailProvider = require('./infra/mail/mailProvider')
const JWT = require('./infra/jwt')

// Application Services
import UserManager from './app/user/UserManager'
const { AuthManagementService } = require('./app/auth')

// Controllers
import UserController from './interfaces/http/controller/UserController'

// Events/Event Subscribers
const Subscribers = require('./domain/events/subscribers')
const EVENTS = require('./domain/events/events')
const EventEmitter = require('./infra/events/EventEmitter')

const container = createContainer()

container.register({
  app: asClass(Application).singleton(),
  config: asValue(Config),
  database: asFunction(Database).singleton(),
  logger: asFunction(Logger),
  repository: asFunction(Repository).singleton(),
  encryptionService: asClass(Encryption).singleton(),
  jwtService: asClass(JWT).singleton(),
  mailProvider: asClass(MailProvider).singleton(),

  // Application Services
  userManager: asClass(UserManager).singleton(),
  authManagementService: asClass(AuthManagementService).singleton(),

  // HTTP Controllers
  userController: asClass(UserController).singleton(),

  // Events/Event Subscribers
  subscribers: asFunction(Subscribers).singleton(),
  EVENTS: asValue(EVENTS),
  eventEmitter: asClass(EventEmitter).singleton()

  // Domain Services
})

export default container
