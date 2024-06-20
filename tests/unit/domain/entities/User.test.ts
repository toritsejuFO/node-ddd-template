import { describe, it, mock } from 'node:test'
import { strictEqual, ok, deepEqual } from 'node:assert/strict'

import User from '@domain/entities/user/User'
import { newUserDto } from 'tests/fixtures/User'

describe('@domain/entities/user/User', () => {
  describe('User::create()', () => {
    it('should create user account successfully', () => {
      const spy = mock.fn(User.create)
      const result = spy(newUserDto)
      strictEqual(result.isOk(), true)

      const userObject = result.value().toObject()

      ok(userObject.id)
      strictEqual(userObject.email, 'johndoe@example.com')
      strictEqual(userObject.isEmailVerified, undefined)
      strictEqual(userObject.isActive, undefined)

      // Expectations
      strictEqual(spy.mock.callCount(), 1)
    })
  })

  describe('User::activate()', () => {
    it('should activate user account successfully', () => {
      const result = User.create(newUserDto)
      ok(result.isOk())

      const user = result.value()
      const spy = mock.fn(user.activate)
      spy.apply(user)

      const userObject = user.toObject()
      strictEqual(userObject.isEmailVerified, true)
      strictEqual(userObject.isActive, true)

      // Expectations
      strictEqual(spy.mock.callCount(), 1)
    })
  })

  describe('User::getLoginTokenPayload()', () => {
    it('should return user login token payload successfully', () => {
      const result = User.create(newUserDto)
      ok(result.isOk())

      const user = result.value()
      const loginTokenPayload = user.getLoginTokenPayload()

      ok(loginTokenPayload.id)
      strictEqual(loginTokenPayload.email, newUserDto.email)
      deepEqual(Object.keys(loginTokenPayload), ['email', 'id'])
    })
  })

  describe('User::getActivateTokenPayload()', () => {
    it('should return user activation token payload successfully', () => {
      const result = User.create(newUserDto)
      ok(result.isOk())

      const user = result.value()
      const loginTokenPayload = user.getActivateTokenPayload()

      ok(loginTokenPayload.id)
      ok(loginTokenPayload.activate)
      strictEqual(loginTokenPayload.email, newUserDto.email)
      deepEqual(Object.keys(loginTokenPayload), ['email', 'id', 'activate'])
    })
  })

  describe('User::login()', () => {
    it('should not login an inactive user', () => {
      const createResult = User.create(newUserDto)
      ok(createResult.isOk())

      const user = createResult.value()
      const loginResult = user.login()
      ok(loginResult.isFail())
    })

    it('should login an active user', () => {
      const createResult = User.create(newUserDto)
      ok(createResult.isOk())

      const user = createResult.value()
      user.activate()
      const loginResult = user.login()
      ok(loginResult.isOk())
    })
  })
})
