import UserRepository from '../../domain/repository/UserRepository'
import User from '../../domain/user/User'
import ValidationError from '../../shared/errors/ValidationError'
import UserManager from './api/UserManager'

export default class implements UserManager {
  readonly userRepository: any
  readonly eventEmitter: any
  readonly encryptionService: any
  readonly EVENTS: any

  constructor(
    userRepository: UserRepository,
    eventEmitter: any,
    encryptionService: any,
    EVENTS: any
  ) {
    this.userRepository = userRepository
    this.eventEmitter = eventEmitter
    this.encryptionService = encryptionService
    this.EVENTS = EVENTS
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll()
    return users.map((user: any) => user.serialize())
  }

  async createANewUser(newUserParams: any) {
    const user = new User(newUserParams)

    const { valid, errors } = user.validate()
    if (!valid) {
      throw new ValidationError('Invalid user creation parameters', errors)
    }

    const existsByEmail = await this.userRepository.existsBy({
      email: user.email
    })
    if (existsByEmail) {
      throw new ValidationError('User with email exists')
    }

    user.password = this.encryptionService.encrypt(user.password)
    const createdUser = await this.userRepository.create(user)
    this.eventEmitter.emitEvent(
      this.EVENTS.NEW_USER_CREATED,
      createdUser.serialize()
    )
    return createdUser.serialize()
  }

  async getUserById(userId: any) {
    const user = await this.userRepository.findOneBy({ userId })
    return user && user.serialize()
  }
}