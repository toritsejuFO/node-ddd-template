import { describe, before, it, after } from 'node:test'
import { strictEqual, ok } from 'node:assert/strict'

import TestAgent from 'supertest/lib/agent'
import { StatusCodes } from 'http-status-codes'

import { App } from '@/App'
import { newUserDto } from 'tests/fixtures/User'
import { afterAll, beforeAll } from 'tests/fixtures/setup'

describe('@presentation/http/controller/UserController', () => {
  let app: App
  let request: TestAgent

  before(async () => {
    ;({ app, request } = await beforeAll())
  })

  after(async () => {
    await afterAll(app)
  })

  describe('UserController::registerUser()', () => {
    describe('Schema Validation Checks', () => {
      it('should not register user with empty body', async () => {
        const res = await request
          .post('/user/register')
          .send({})
          .set('Accept', 'application/json')

        strictEqual(res.status, StatusCodes.BAD_REQUEST)
        strictEqual(res.body.success, false)
        strictEqual(res.body.message, 'Schema validation error')
        strictEqual(res.body.errors.length, 4)
        strictEqual(res.body.errors[0].field, 'firstname')
        strictEqual(res.body.errors[0].message, 'Required')
        strictEqual(res.body.errors[1].field, 'lastname')
        strictEqual(res.body.errors[1].message, 'Required')
        strictEqual(res.body.errors[2].field, 'email')
        strictEqual(res.body.errors[2].message, 'Required')
        strictEqual(res.body.errors[3].field, 'password')
        strictEqual(res.body.errors[3].message, 'Required')
      })

      it('should not register user with invalid email', async () => {
        const newUser = Object.assign({}, newUserDto, {
          email: 'invalid-email'
        })

        const res = await request
          .post('/user/register')
          .send(newUser)
          .set('Accept', 'application/json')

        strictEqual(res.status, StatusCodes.BAD_REQUEST)
        strictEqual(res.body.success, false)
        strictEqual(res.body.message, 'Schema validation error')
        strictEqual(res.body.errors.length, 1)
        strictEqual(res.body.errors[0].field, 'email')
        strictEqual(res.body.errors[0].message, 'Invalid email')
      })

      it('should not register user with invalid password length', async () => {
        const newUser = Object.assign({}, newUserDto, {
          password: 'pass'
        })

        const res = await request
          .post('/user/register')
          .send(newUser)
          .set('Accept', 'application/json')

        strictEqual(res.status, StatusCodes.BAD_REQUEST)
        strictEqual(res.body.success, false)
        strictEqual(res.body.message, 'Schema validation error')
        strictEqual(res.body.errors.length, 1)
        strictEqual(res.body.errors[0].field, 'password')
        strictEqual(
          res.body.errors[0].message,
          'String must contain at least 8 character(s)'
        )
      })
    })

    describe('User Registration', () => {
      it('should register a new user', async () => {
        const res = await request
          .post('/user/register')
          .send(newUserDto)
          .set('Accept', 'application/json')

        strictEqual(res.status, StatusCodes.CREATED)
        strictEqual(res.body.success, true)
        ok(res.body.data.id)
        strictEqual(res.body.data.firstname, newUserDto.firstname)
        strictEqual(res.body.data.lastname, newUserDto.lastname)
        strictEqual(res.body.data.email, newUserDto.email)
        strictEqual(res.body.data.isEmailVerified, false)
        strictEqual(res.body.data.isActive, false)
      })

      it('should not register a user with an existing email', async () => {
        const res = await request
          .post('/user/register')
          .send(newUserDto)
          .set('Accept', 'application/json')

        strictEqual(res.status, StatusCodes.CONFLICT)
        strictEqual(res.body.success, false)
        strictEqual(res.body.message, 'User already exists')
      })
    })
  })
})
