import container from '@/container'
import { App } from '@/App'

const app: App = container.resolve('app')

app
  .start(container)
  .then(() => {
    app.getLogger().info(':::APP STARTED:::')
  })
  .catch((error) => {
    app.getLogger().error(':::APP FAILED TO START:::')
    app.getLogger().error(error)
    process.exit(1)
  })
