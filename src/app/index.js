class App {
  constructor({ server, database, logger, eventEmitter, subscribers }) {
    this.server = server
    this.database = database
    this.logger = logger
    this.eventEmitter = eventEmitter
    this.subscribers = subscribers
  }

  async start() {
    this.subscribers.map((s) =>
      this.eventEmitter.registerSubscriber(s.EVENT, s.handler.bind(s))
    )
    this.database.authenticate
    this.server.start()
  }
}

module.exports = App
