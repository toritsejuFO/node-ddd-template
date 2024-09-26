import { Server } from 'node:http'

import express, { Application } from 'express'
import { AwilixContainer } from 'awilix'

import { Database } from '@infra/database'
import { Config } from '@shared/config'
import { Logger } from '@shared/logger'
import { IEventHandler } from '@/app/eventhandlers/IEventHandler'
import { IEventPublisher } from '@/domain/events/IEventPublisher'

export interface IApp {
  app: Application

  start(container: AwilixContainer): Promise<void>
  stop(): void
  getLogger(): Logger
}

export class App implements IApp {
  readonly app: Application
  server!: Server

  constructor(
    private readonly config: Config,
    private readonly logger: Logger,
    private readonly database: Database,
    private readonly eventPublisher: IEventPublisher,
    private readonly eventHandlers: IEventHandler[]
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
    this.eventHandlers.map((h: IEventHandler) =>
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
