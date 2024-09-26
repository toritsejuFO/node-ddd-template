import { asClass, AwilixContainer } from 'awilix'
import supertest from 'supertest'
import TestAgent from 'supertest/lib/agent'

import container from '@/container'
import { App } from '@/App'
import { MailService } from 'tests/fixtures/MailService'

export const beforeAll = async (): Promise<{
  app: App
  request: TestAgent
  container: AwilixContainer
}> => {
  container.register({
    mailService: asClass(MailService).singleton()
  })

  const app: App = container.resolve('app')
  app.start(container)
  const request = supertest(app.app)

  return { app, request, container }
}

export const afterAll = async (app: App) => {
  app.stop()
}
