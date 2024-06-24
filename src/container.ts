import {
  createContainer,
  asValue,
  asFunction,
  asClass,
  InjectionMode,
  Resolver,
  Lifetime
} from 'awilix'

import App from '@/App'

// EventHandlers
import NewUserCreatedHandler from '@app/eventhandlers/NewUserCreatedHandler'

// Infra
import Config from '@infra/config'
import Database from '@infra/database'
import Logger from '@shared/logger'
import HashService from '@/infra/hashing'
import NodeMailer from '@infra/mail/NodeMailer'
import JWT from '@infra/jwt'
import EventPublisher from '@/infra/eventpublisher/EventPublisher'

// Presentation
import Router from '@presentation/http/Router'

const container = createContainer({ injectionMode: InjectionMode.CLASSIC })

container.loadModules(
  [
    'src/app/services/**/*.ts',
    'src/app/eventhandlers/**/*.ts',
    'src/app/adapters/**/*.ts',
    'src/infra/repositories/**/*.ts',
    [
      'src/presentation/http/controllers/**/*.ts',
      {
        register: asClass,
        lifetime: Lifetime.SCOPED
      }
    ],
    [
      'src/presentation/http/middlewares/**/*.ts',
      {
        register: asFunction,
        lifetime: Lifetime.SCOPED
      }
    ]
  ],
  {
    formatName: 'camelCase',
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
      register: asClass
    }
  }
)

container.register({
  // Application
  app: asClass(App).singleton(),

  // EventHandlers (as array to register multiple handlers at once)
  eventHandlers: asArray([asClass(NewUserCreatedHandler).singleton()]),

  // Infra
  config: asValue(Config),
  database: asClass(Database).singleton(),
  logger: asFunction(Logger).singleton(),
  hashService: asClass(HashService).singleton(),
  mailService: asClass(NodeMailer).singleton(),
  jwtService: asClass(JWT).singleton(),
  eventPublisher: asClass(EventPublisher).singleton(),

  // Presentation
  router: asClass(Router).singleton()
})

function asArray<T>(resolvers: Resolver<T>[]): Resolver<T[]> {
  return {
    resolve: (c) => resolvers.map((r) => r.resolve(c))
  }
}

export default container
