import {
  createContainer,
  asValue,
  asFunction,
  asClass,
  InjectionMode,
  Resolver,
  Lifetime
} from 'awilix'

import { App } from '@/App'

// App
import { NewUserCreatedHandler } from '@app/eventhandlers/NewUserCreatedHandler'

// Infra
import { Database } from '@infra/database'
import { logger } from '@shared/logger'
import { HashService } from '@/infra/hashing'
import { MailService } from '@infra/mail/NodeMailer'
import { JwtService } from '@infra/jwt'
import { EventPublisher } from '@/infra/eventpublisher/EventPublisher'

// Presentation
import { Router } from '@presentation/http/Router'

// Shared
import { config } from '@shared/config'

const container = createContainer({ injectionMode: InjectionMode.CLASSIC })

container
  .register({
    // Application
    app: asClass(App).singleton(),

    // EventHandlers (as array to register multiple handlers at once)
    eventHandlers: asArray([asClass(NewUserCreatedHandler).singleton()]),

    // Infra
    config: asValue(config),
    database: asClass(Database).singleton(),
    logger: asFunction(logger).singleton(),
    hashService: asClass(HashService).singleton(),
    mailService: asClass(MailService).singleton(),
    jwtService: asClass(JwtService).singleton(),
    eventPublisher: asClass(EventPublisher).singleton(),

    router: asClass(Router).singleton()
  })
  .loadModules(
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

function asArray<T>(resolvers: Resolver<T>[]): Resolver<T[]> {
  return {
    resolve: (c) => resolvers.map((r) => r.resolve(c))
  }
}

export default container
