const container = require('./src/container')

const app = container.resolve('app')

app
  .start()
  .then(() => {
    app.logger.log(':::APP STARTED:::')
  })
  .catch((error) => {
    app.logger.log(error)
    app.logger.log(':::APP FAILED TO START:::')
  })
