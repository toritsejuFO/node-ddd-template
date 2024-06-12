import {
  createContainer,
  asValue,
  asFunction,
  asClass,
  InjectionMode,
  Resolver
} from 'awilix'

import App from './App'

// Application Services
import UserManager from './app/services/UserManager'
import AuthManager from './app/services/AuthManager'

// EventHandlers
import NewUserCreatedHandler from './app/eventhandlers/NewUserCreatedHandler'

// Domain Services
import MailService from './domain/services/MailService'

// Infra
import Config from './infra/config'
import Database from './infra/database'
import Logger from './infra/logger'
import Encryption from './infra/encryption'
import MailProvider from './infra/mail/MailProvider'
import JWT from './infra/jwt'
import EventPublisher from './infra/events/EventPublisher'

// Repositories
import UserRepository from './infra/repository/user/UserRepository'

// Presentation
import Router from './presentation/http/Router'
import routeLogger from './presentation/http/middleware/RouteLogger'
import errorHandler from './presentation/http/middleware/ErrorHandler'
import authGuard from './presentation/http/middleware/AuthGuard'
import invalidRouteHandler from './presentation/http/middleware/InvalidRouteHandler'

// Controllers
import UserController from './presentation/http/controller/UserController'
import AuthController from './presentation/http/controller/AuthController'

const container = createContainer({ injectionMode: InjectionMode.CLASSIC })

container.register({
  // Application
  app: asClass(App).singleton(),

  // Application Services
  userManager: asClass(UserManager).singleton(),
  authManager: asClass(AuthManager).singleton(),

  // EventHandlers
  eventHandlers: asArray([asClass(NewUserCreatedHandler).singleton()]),

  // Domain Services
  mailService: asClass(MailService).singleton(),

  // Infra
  config: asValue(Config),
  database: asClass(Database).singleton(),
  logger: asFunction(Logger),
  encryptionService: asClass(Encryption).singleton(),
  mailProvider: asClass(MailProvider).singleton(),
  jwtService: asClass(JWT).singleton(),
  eventPublisher: asClass(EventPublisher).singleton(),

  // Repositories
  userRepository: asClass(UserRepository).singleton(),

  // Presentation
  router: asClass(Router).singleton(),
  routeLogger: asFunction(routeLogger).singleton(),
  errorHandler: asFunction(errorHandler).singleton(),
  authGuard: asFunction(authGuard).singleton(),
  invalidRouteHandler: asFunction(invalidRouteHandler).singleton(),

  // Controllers
  userController: asClass(UserController).singleton(),
  authController: asClass(AuthController).singleton()
})

function asArray<T>(resolvers: Resolver<T>[]): Resolver<T[]> {
  return {
    resolve: (c) => resolvers.map((r) => r.resolve(c))
  }
}

export default container
