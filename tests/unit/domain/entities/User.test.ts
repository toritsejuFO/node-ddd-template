import { describe, before, it, mock } from 'node:test'
import assert from 'node:assert/strict'

import User from '@domain/entities/user/User'
import { NewUserDto } from '@/app/dtos/UserDto'

describe('@domain/entities/user/User', () => {
  let newUserProps: NewUserDto

  before(() => {
    newUserProps = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'johndoe@example.com',
      password: 'password'
    }
  })

  describe('User::create()', () => {
    it('should create user account successfully', () => {
      const spy = mock.fn(User.create)

      const result = spy(newUserProps)
      assert.strictEqual(result.isOk(), true)

      const userObject = result.value().toObject()

      assert.ok(userObject.id)
      assert.strictEqual(userObject.email, 'johndoe@example.com')
      assert.strictEqual(userObject.isEmailVerified, undefined)
      assert.strictEqual(userObject.isActive, undefined)

      // Expectations
      assert.strictEqual(spy.mock.callCount(), 1)
    })
  })

  describe('User::activate()', () => {
    it('should activate user account successfully', () => {
      const result = User.create(newUserProps)
      assert.ok(result.isOk())

      const user = result.value()
      const spy = mock.fn(user.activate)
      spy.apply(user)

      const userObject = user.toObject()
      assert.strictEqual(userObject.isEmailVerified, true)
      assert.strictEqual(userObject.isActive, true)

      // Expectations
      assert.strictEqual(spy.mock.callCount(), 1)
    })
  })

  describe('User::getLoginTokenPayload()', () => {
    it('should return user login token payload successfully', () => {
      const result = User.create(newUserProps)
      assert.ok(result.isOk())

      const user = result.value()
      const spy = mock.fn(user.getLoginTokenPayload)
      const loginTokenPayload = spy.apply(user)

      assert.ok(loginTokenPayload.id)
      assert.strictEqual(loginTokenPayload.email, newUserProps.email)
      assert.deepEqual(Object.keys(loginTokenPayload), ['email', 'id'])

      // Expectations
      assert.strictEqual(spy.mock.callCount(), 1)
    })
  })

  describe('User::getActivateTokenPayload()', () => {
    it('should return user activation token payload successfully', () => {
      const result = User.create(newUserProps)
      assert.ok(result.isOk())

      const user = result.value()
      const spy = mock.fn(user.getActivateTokenPayload)
      const loginTokenPayload = spy.apply(user)

      assert.ok(loginTokenPayload.id)
      assert.ok(loginTokenPayload.activate)
      assert.strictEqual(loginTokenPayload.email, newUserProps.email)
      assert.deepEqual(Object.keys(loginTokenPayload), [
        'email',
        'id',
        'activate'
      ])

      // Expectations
      assert.strictEqual(spy.mock.callCount(), 1)
    })
  })

  describe('User::login()', () => {
    it('should not login an inactive user', () => {
      const createResult = User.create(newUserProps)
      assert.ok(createResult.isOk())

      const user = createResult.value()
      const spy = mock.fn(user.login)
      const loginResult = spy.apply(user)

      assert.ok(loginResult.isFail())

      // Expectations
      assert.strictEqual(spy.mock.callCount(), 1)
    })
  })

  describe('User::login()', () => {
    it('should login an active user', () => {
      const createResult = User.create(newUserProps)
      assert.ok(createResult.isOk())

      const user = createResult.value()
      user.activate()
      const spy = mock.fn(user.login)
      const loginResult = spy.apply(user)

      assert.ok(loginResult.isOk())

      // Expectations
      assert.strictEqual(spy.mock.callCount(), 1)
    })
  })
})
