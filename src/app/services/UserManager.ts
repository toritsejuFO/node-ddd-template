import UserRepository from '../../domain/repository/UserRepository.interface'
import User from '../../domain/entities/user/User'
import ValidationError from '../../shared/errors/ValidationError'
import UserManager from './api/UserManager.interface'
import NewUserCreatedEvent from '../../domain/events/NewUserCreatedEvent'

export default class implements UserManager {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: any,
    private readonly encryptionService: any
  ) {}

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
    this.eventPublisher.publishEvent(
      new NewUserCreatedEvent(createdUser.serialize())
    )
    return createdUser.serialize()
  }

  async getUserById(userId: any) {
    const user = await this.userRepository.findOneBy({ userId })
    return user && user.serialize()
  }
}
