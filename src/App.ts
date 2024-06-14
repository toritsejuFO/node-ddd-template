import express, { Express } from 'express'
import { AwilixContainer } from 'awilix'

import { Database } from './infra/database'
import { Config } from './infra/config'
import { Logger } from './shared/logger'
import EventHandler from './app/eventhandlers/EventHandler.interface'
import EventPublisher from './domain/events/EventPublisher.interface'

export interface App {
  server: Express

  start(container: AwilixContainer): Promise<void>
  getLogger(): Logger
}

export default class implements App {
  readonly server: Express

  constructor(
    private readonly config: Config,
    private readonly logger: Logger,
    private readonly database: Database,
    private readonly eventPublisher: EventPublisher,
    private readonly eventHandlers: EventHandler[]
  ) {
    this.server = express()
    this.database.connect()
  }

  async start(container: AwilixContainer) {
    this.server.disable('x-powered-by')
    this.server.use(express.json())

    // Setup all routes
    container.resolve('router').setupRoutes(this.server, container)

    // Register all eventhandlers
    this.eventHandlers.map((h: EventHandler) =>
      this.eventPublisher.registerHandler(h)
    )

    // Start the server
    const { port } = this.config.app
    this.server.listen(port, () => {
      this.logger.info('Server is listening on port %s', port)
    })
  }

  getLogger() {
    return this.logger
  }
}
