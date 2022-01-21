const User = require('../../domain/user/User')
const { ValidationError } = require('../../shared/exceptions')

class UserManagementService {
  #userRepository
  #eventEmitter

  constructor({ repository: { userRepository }, eventEmitter, EVENTS }) {
    this.#userRepository = userRepository
    this.#eventEmitter = eventEmitter
    this.EVENTS = EVENTS
  }

  async getAllUsers() {
    const users = await this.#userRepository.findAll()
    this.#eventEmitter.emitEvent(this.EVENTS.FETCHED_ALL_USERS, {
      userCount: users.length
    })
    return users
  }

  async createANewUser(newUserParams) {
    const user = new User(newUserParams)

    const { valid, errors } = user.validate()
    if (!valid) {
      throw new ValidationError('Invalid user creation parameters', errors)
    }

    const existsByEmail = await this.#userRepository.existsBy({
      email: user.email
    })
    if (existsByEmail) {
      throw new ValidationError('User with email exists')
    }

    const createdUser = await this.#userRepository.create(user)
    return createdUser.toJSON()
  }
}

module.exports = UserManagementService
