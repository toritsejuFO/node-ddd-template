import { describe, before, it, after, mock } from 'node:test'
import { strictEqual } from 'node:assert/strict'

import TestAgent from 'supertest/lib/agent'
import { StatusCodes } from 'http-status-codes'
import { AwilixContainer } from 'awilix'

import { App } from '@/App'
import { newUserDto } from 'tests/fixtures/User'
import { afterAll, beforeAll } from 'tests/fixtures/setup'
import { UserDto } from '@/app/dtos/UserDto'

describe('@presentation/http/controller/UserController', () => {
  let app: App
  let request: TestAgent
  let container: AwilixContainer
  let activationToken: string
  let loginToken: string
  let currentUser: UserDto

  before(async () => {
    ;({ app, request, container } = await beforeAll())
  })

  after(async () => {
    await afterAll(app)
  })

  describe('UserController::registerUser()', () => {
    describe('Schema Validation Checks', () => {
      it('400 - should not register user with empty body', async () => {
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

      it('400 - should not register user with invalid email', async () => {
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

      it('400 - should not register user with invalid password spec', async () => {
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
        strictEqual(res.body.errors.length, 2)
        strictEqual(res.body.errors[0].field, 'password')
        strictEqual(res.body.errors[1].field, 'password')
        strictEqual(
          res.body.errors[0].message,
          'Password must be at least 8 characters long'
        )
        strictEqual(
          res.body.errors[1].message,
          'Password must contain at least one uppercase, one lowercase, one number and one special character'
        )
      })
    })

    describe('User Registration', () => {
      it('201 - should register a new user successfully', async () => {
        const mockedSpy = mock.method(container.cradle.mailService, 'sendMail')

        const res = await request
          .post('/user/register')
          .send(newUserDto)
          .set('Accept', 'application/json')

        strictEqual(res.status, StatusCodes.CREATED)
        strictEqual(res.body.success, true)
        strictEqual(!!res.body.data.id, true)
        strictEqual(res.body.data.firstname, newUserDto.firstname)
        strictEqual(res.body.data.lastname, newUserDto.lastname)
        strictEqual(res.body.data.email, newUserDto.email)
        strictEqual(res.body.data.isEmailVerified, false)
        strictEqual(res.body.data.isActive, false)

        // save activationToken for reuse if test passes
        activationToken =
          mockedSpy.mock.calls[0].arguments[0].data.activationToken
      })

      it('400 - should not register a user with an existing email', async () => {
        const res = await request
          .post('/user/register')
          .send(newUserDto)
          .set('Accept', 'application/json')

        strictEqual(res.status, StatusCodes.BAD_REQUEST)
        strictEqual(res.body.success, false)
        strictEqual(res.body.message, 'User already exists')
      })
    })
  })

  describe('Authentication Flow', () => {
    describe('UserController::login()', () => {
      it('401 - should not login inactive user', async () => {
        const res = await request
          .post('/user/login')
          .send({
            email: newUserDto.email,
            password: newUserDto.password
          })
          .set('Accept', 'application/json')

        strictEqual(res.status, StatusCodes.UNAUTHORIZED)
        strictEqual(res.body.success, false)
        strictEqual(res.body.message, 'Account not active')
      })
    })

    describe('UserController::activateUser()', () => {
      it('200 - should activate user successfuly', async () => {
        const res = await request
          .get('/user/activate')
          .query({ token: activationToken })
          .set('Accept', 'application/json')

        strictEqual(res.status, StatusCodes.OK)
        strictEqual(res.body.success, true)
        strictEqual(res.body.message, 'User account activated')
      })
    })

    describe('UserController::login()', () => {
      it('200 - should login user successfuly', async () => {
        const res = await request
          .post('/user/login')
          .send({
            email: newUserDto.email,
            password: newUserDto.password
          })
          .set('Accept', 'application/json')

        strictEqual(res.status, StatusCodes.OK)
        strictEqual(res.body.success, true)
        strictEqual(res.body.message, 'User logged in successfully')
        strictEqual(!!res.body.data.token, true)

        // save loginToken for reuse test if test passes
        loginToken = res.body.data.token
      })
    })
  })

  describe('UserController::getAllUsers()', () => {
    it('200 - should fetch all users successfuly', async () => {
      const res = await request
        .get('/users')
        .set('Accept', 'application/json')
        .set('X-Auth-Token', loginToken)

      strictEqual(res.status, StatusCodes.OK)
      strictEqual(res.body.success, true)
      strictEqual(res.body.message, 'User accounts fetched successfully')
      strictEqual(res.body.data.length, 1)
    })
  })

  describe('UserController::getCurrentUser()', () => {
    it('200 - should fetch current user successfuly', async () => {
      const res = await request
        .get('/user/me')
        .set('Accept', 'application/json')
        .set('X-Auth-Token', loginToken)

      strictEqual(res.status, StatusCodes.OK)
      strictEqual(res.body.success, true)
      strictEqual(res.body.message, 'User account fetched successfully')
      strictEqual(res.body.data.email, newUserDto.email)

      // save currentUser for reuse if test passes
      currentUser = res.body.data
    })
  })

  describe('UserController::getUserById()', () => {
    it('200 - should fetch user by id successfuly', async () => {
      const res = await request
        .get(`/user/${currentUser.id}`)
        .set('Accept', 'application/json')
        .set('X-Auth-Token', loginToken)

      strictEqual(res.status, StatusCodes.OK)
      strictEqual(res.body.success, true)
      strictEqual(res.body.message, 'User account fetched successfully')
      strictEqual(res.body.data.email, newUserDto.email)
    })
  })
})
