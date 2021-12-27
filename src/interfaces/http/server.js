const express = require('express')

class Server {
  constructor({ config, logger, router }) {
    this.config = config
    this.logger = logger

    this.server = express()
    this.server.disable('x-powered-by')
    this.server.use(express.json())
    this.server.use(router)
  }

  start() {
    const { port } = this.config.app
    this.server.listen(port, () => {
      this.logger.log('Server is listening on port', port)
    })
  }
}

module.exports = Server
