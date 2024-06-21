import { asClass } from 'awilix'
import supertest from 'supertest'
import TestAgent from 'supertest/lib/agent'

import container from '@/container'
import { App } from '@/App'
import Nodemailer from 'tests/fixtures/Nodemailer'

export const beforeAll = async (): Promise<{
  app: App
  request: TestAgent
}> => {
  container.register({
    mailService: asClass(Nodemailer).singleton()
  })

  const app: App = container.resolve('app')
  app.start(container)
  const request = supertest(app.app)

  return { app, request }
}

export const afterAll = async (app: App) => {
  app.stop()
}
