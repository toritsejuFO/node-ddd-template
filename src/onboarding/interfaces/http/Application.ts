import express, { Express } from 'express'
import Router from './Router'

export default class Application {
  private readonly config: any
  private readonly logger: any
  private readonly database: any
  private readonly eventEmitter: any
  private readonly subscribers: any
  private readonly server: Express

  constructor(ctx: any) {
    this.config = ctx.config
    this.logger = ctx.logger
    this.database = ctx.database
    this.eventEmitter = ctx.eventEmitter
    this.subscribers = ctx.subscribers
    this.server = express()
  }

  async start() {
    this.server.disable('x-powered-by')
    this.server.use(express.json())

    // Setup all routes
    Router.setupRoutes(this.server.bind(this))

    // Register all subscribers
    this.subscribers.map((s: any) =>
      this.eventEmitter.registerSubscriber(s.EVENT, s.handler.bind(s))
    )

    // Start the database connection
    this.database.authenticate

    // Start the server
    const { port } = this.config.app
    this.server.listen(port, () => {
      this.logger.info('Server is listening on port %s', port)
    })
  }
}
