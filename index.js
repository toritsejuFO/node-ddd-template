const container = require('./src/container')

const app = container.resolve('app')

app
  .start()
  .then(() => {
    app.logger.info(':::APP STARTED:::')
  })
  .catch((error) => {
    app.logger.error(error)
    app.logger.error(':::APP FAILED TO START:::')
    process.exit(1)
  })
