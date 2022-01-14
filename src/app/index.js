class App {
  constructor({ server, database, logger, eventEmitter, listeners, EVENTS }) {
    this.server = server
    this.database = database
    this.logger = logger
    this.eventEmitter = eventEmitter
    this.listeners = listeners
    this.EVENTS = EVENTS
  }

  async start() {
    this.listeners.map((l) =>
      this.eventEmitter.registerListener(l.EVENT, l.handler.bind(l))
    )
    this.database.authenticate
    this.server.start()
  }
}

module.exports = App
