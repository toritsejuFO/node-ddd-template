import {
  createContainer,
  asValue,
  asFunction,
  asClass,
  InjectionMode
} from 'awilix'

import App from './App'

// Infra
import Config from './infra/config'
import Database from './infra/database'
import Logger from './infra/logger'
import Encryption from './infra/encryption'
import MailProvider from './infra/mail/mailProvider'
import JWT from './infra/jwt'
import UserRepository from './infra/repository/user/UserRepository'

// Application Services
import UserManager from './app/services/UserManager'
import AuthManager from './app/services/AuthManager'

// Controllers
import UserController from './interface/http/controller/UserController'
import AuthController from './interface/http/controller/AuthController'

// Events/Event Subscribers
import Subscribers from './domain/events/subscribers'
import EVENTS from './domain/events/events'
import EventEmitter from './infra/events/EventEmitter'

// Interfaces
import Router from './interface/http/Router'
import routeLogger from './interface/http/middleware/routeLogger'
import errorHandler from './interface/http/middleware/errorHandler'
import authGuard from './interface/http/middleware/authGuard'
import invalidRouteHandler from './interface/http/middleware/invalidRouteHandler'

const container = createContainer({ injectionMode: InjectionMode.CLASSIC })

container.register({
  app: asClass(App).singleton(),
  config: asValue(Config),
  database: asClass(Database).singleton(),
  logger: asFunction(Logger),
  encryptionService: asClass(Encryption).singleton(),
  jwtService: asClass(JWT).singleton(),
  mailProvider: asClass(MailProvider).singleton(),

  // Repositories
  userRepository: asClass(UserRepository).singleton(),

  // Application Services
  userManager: asClass(UserManager).singleton(),
  authManager: asClass(AuthManager).singleton(),

  // HTTP Controllers
  userController: asClass(UserController).singleton(),
  authController: asClass(AuthController).singleton(),

  // Events/Event Subscribers
  subscribers: asFunction(Subscribers).singleton(),
  EVENTS: asValue(EVENTS),
  eventEmitter: asClass(EventEmitter).singleton(),

  // Interfaces
  router: asClass(Router).singleton(),
  routeLogger: asFunction(routeLogger).singleton(),
  errorHandler: asFunction(errorHandler).singleton(),
  authGuard: asFunction(authGuard).singleton(),
  invalidRouteHandler: asFunction(invalidRouteHandler).singleton()
})

export default container
