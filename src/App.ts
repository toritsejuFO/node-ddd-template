import express, { Express } from 'express'
import { AwilixContainer } from 'awilix'

import { Database } from './infra/database'
import { Config } from './infra/config'
import { Logger } from './infra/logger'

export interface IApp {
  config: any
  logger: any
  database: Database
  eventEmitter: any
  subscribers: any
  server: Express

  start(container: AwilixContainer): Promise<void>
}

export default class App implements IApp {
  readonly config: Config
  readonly logger: Logger
  readonly database: Database
  readonly eventEmitter: any
  readonly subscribers: any
  readonly server: Express

  constructor(
    config: Config,
    logger: Logger,
    database: Database,
    eventEmitter: any,
    subscribers: any
  ) {
    this.config = config
    this.logger = logger
    this.database = database
    this.eventEmitter = eventEmitter
    this.subscribers = subscribers
    this.server = express()
  }

  async start(container: AwilixContainer) {
    this.server.disable('x-powered-by')
    this.server.use(express.json())

    // Setup all routes
    container.resolve('router').setupRoutes(this.server, container)

    // Register all subscribers
    this.subscribers.map((s: any) =>
      this.eventEmitter.registerSubscriber(s.EVENT, s.handler.bind(s))
    )

    // Start the database connection
    this.database.start()

    // Start the server
    const { port } = this.config.app
    this.server.listen(port, () => {
      this.logger.info('Server is listening on port %s', port)
    })
  }
}
