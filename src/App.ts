import { Server } from 'node:http'

import express, { Application } from 'express'
import { AwilixContainer } from 'awilix'

import { Database } from '@infra/database'
import { Config } from '@infra/config'
import { Logger } from '@shared/logger'
import EventHandler from '@app/eventhandlers/EventHandler.interface'
import EventPublisher from '@domain/events/EventPublisher.interface'

export interface App {
  app: Application

  start(container: AwilixContainer): Promise<void>
  stop(): void
  getLogger(): Logger
}

export default class implements App {
  readonly app: Application
  server!: Server

  constructor(
    private readonly config: Config,
    private readonly logger: Logger,
    private readonly database: Database,
    private readonly eventPublisher: EventPublisher,
    private readonly eventHandlers: EventHandler[]
  ) {
    this.app = express()
    this.database.connect()
  }

  async start(container: AwilixContainer) {
    this.app.disable('x-powered-by')
    this.app.use(express.json())

    // Setup all routes
    container.resolve('router').setupRoutes(this.app, container)

    // Register all eventhandlers
    this.eventHandlers.map((h: EventHandler) =>
      this.eventPublisher.registerHandler(h)
    )

    // Start the app
    const { port } = this.config.app
    this.server = this.app.listen(port, () => {
      this.logger.info('Server is listening on port %s', port)
    })
  }

  async stop() {
    this.server.close()
    this.database.disconnect()
  }

  getLogger() {
    return this.logger
  }
}
