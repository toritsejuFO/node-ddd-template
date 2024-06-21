import container from '@/container'
import { App } from '@/App'

const app: App = container.resolve('app')

app
  .start(container)
  .then(() => {
    app.getLogger().info(':::APP STARTED:::')
  })
  .catch((error) => {
    app.getLogger().error(error)
    app.getLogger().error(':::APP FAILED TO START:::')
    process.exit(1)
  })
