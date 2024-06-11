import container from './container'
import { IApp } from './App'

const app: IApp = container.resolve('app')

app
  .start(container)
  .then(() => {
    app.logger.info(':::APP STARTED:::')
  })
  .catch((error) => {
    app.logger.error(error)
    app.logger.error(':::APP FAILED TO START:::')
    process.exit(1)
  })
