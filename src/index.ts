import container from './onboarding/container'

const app = container.resolve('app')

app
  .start()
  .then(() => {
    app.logger.info(':::APP STARTED:::')
  })
  .catch((error: any) => {
    app.logger.error(error)
    app.logger.error(':::APP FAILED TO START:::')
    process.exit(1)
  })
