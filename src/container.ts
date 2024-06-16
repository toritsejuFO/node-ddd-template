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

// EventHandlers
import NewUserCreatedHandler from './app/eventhandlers/NewUserCreatedHandler'

// Domain
import {
  ToDtoAdapter,
  ToDomainAdapter,
  ToPersistenceAdapter
} from './domain/adapters/UserAdapter'
import UserService from './domain/services/UserService'

// Infra
import Config from './infra/config'
import Database from './infra/database'
import Logger from './shared/logger'
import Encryption from './infra/encryption'
import NodeMailer from './infra/mail/NodeMailer'
import JWT from './infra/jwt'
import EventPublisher from './infra/events/EventPublisher'

// Repositories
import UserRepository from './infra/repositories/user/UserRepository'

// Presentation
import Router from './presentation/http/Router'
import routeLogger from './presentation/http/middlewares/RouteLogger'
import errorHandler from './presentation/http/middlewares/ErrorHandler'
import authGuard from './presentation/http/middlewares/AuthGuard'
import invalidRouteHandler from './presentation/http/middlewares/InvalidRouteHandler'

// Controllers
import UserController from './presentation/http/controllers/UserController'

const container = createContainer({ injectionMode: InjectionMode.CLASSIC })

container.register({
  // Application
  app: asClass(App).singleton(),

  // Application Services
  userManager: asClass(UserManager).singleton(),

  // EventHandlers
  eventHandlers: asArray([asClass(NewUserCreatedHandler).singleton()]),

  // Domain
  toDtoAdapter: asClass(ToDtoAdapter).singleton(),
  toDomainAdapter: asClass(ToDomainAdapter).singleton(),
  toPersistenceAdapter: asClass(ToPersistenceAdapter).singleton(),
  userService: asClass(UserService).singleton(),

  // Infra
  config: asValue(Config),
  database: asClass(Database).singleton(),
  logger: asFunction(Logger).singleton(),
  encryptionService: asClass(Encryption).singleton(),
  mailService: asClass(NodeMailer).singleton(),
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
  userController: asClass(UserController).scoped()
})

function asArray<T>(resolvers: Resolver<T>[]): Resolver<T[]> {
  return {
    resolve: (c) => resolvers.map((r) => r.resolve(c))
  }
}

export default container
