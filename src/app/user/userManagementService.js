const User = require('../../domain/user/User')
const { ValidationError } = require('../../shared/exceptions')

class UserManagementService {
  #userRepository
  #eventEmitter
  #encryptionService

  constructor({
    repository: { userRepository },
    eventEmitter,
    encryptionService,
    EVENTS
  }) {
    this.#userRepository = userRepository
    this.#eventEmitter = eventEmitter
    this.#encryptionService = encryptionService
    this.EVENTS = EVENTS
  }

  async getAllUsers() {
    const users = await this.#userRepository.findAll()
    return users.map((user) => user.serialize())
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

    user.password = this.#encryptionService.encrypt(user.password)
    const createdUser = await this.#userRepository.create(user)
    this.#eventEmitter.emitEvent(
      this.EVENTS.NEW_USER_CREATED,
      createdUser.serialize()
    )
    return createdUser.serialize()
  }
}

module.exports = UserManagementService
