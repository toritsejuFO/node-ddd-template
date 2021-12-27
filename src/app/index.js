class App {
  constructor({ server, database, logger }) {
    this.server = server
    this.database = database
    this.logger = logger
  }

  async start() {
    this.database.authenticate
    this.server.start()
  }
}

module.exports = App
