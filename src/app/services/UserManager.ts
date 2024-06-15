import { IAdapter, Result } from 'types-ddd'

import UserRepository from '../../domain/repositories/UserRepository.interface'
import User from '../../domain/entities/user/User'
import UserManager from './api/UserManager.interface'
import NewUserCreatedEvent from '../../domain/events/NewUserCreatedEvent'
import UserService from '../../domain/services/api/UserService.interface'
import EncryptionService from './api/EncryptionService.interface'
import EventPublisher from '../../domain/events/EventPublisher.interface'
import { UserDtoCreate, UserDto } from '../dtos/UserDto'
import JwtService from './api/JwtService.interface'
import { LoginDto } from '../dtos/AuthDto'

export default class implements UserManager {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly encryptionService: EncryptionService,
    private readonly userService: UserService,
    private readonly toDtoAdapter: IAdapter<User, UserDto>,
    private readonly jwtService: JwtService
  ) {}

  async getAllUsers() {
    const users = await this.userRepository.findAll()
    const userDtoList = users.map((user: User) =>
      this.toDtoAdapter.build(user).value()
    )
    return Result.Ok(userDtoList)
  }

  async createANewUser(userDto: UserDtoCreate) {
    const result = await this.userService.registerUser(userDto)
    if (result.isFail()) {
      return Result.fail(result.error(), result.metaData())
    }

    let user: User = result.value()
    user.change(
      'password',
      this.encryptionService.encrypt(user.get('password'))
    )
    user = await this.userRepository.save(user)

    const retUserDto = this.toDtoAdapter.build(user).value()
    const activationToken = this.jwtService.encode(user.tokenizablePayload())
    this.eventPublisher.publishEvent(
      new NewUserCreatedEvent({ ...retUserDto, activationToken })
    )
    return Result.Ok(retUserDto)
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    const user = await this.userRepository.findOneByEmail(email)
    if (!user) {
      return Result.fail('User not found')
    }

    const valid = this.encryptionService.compare(password, user.get('password'))
    if (!valid) {
      return Result.fail('Email or password is invalid')
    }

    const authToken = this.jwtService.encode(user.tokenizablePayload())
    return Result.Ok(authToken)
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOneById(id)
    if (!user) return Result.fail('User not found')
    return Result.Ok(this.toDtoAdapter.build(user).value())
  }
}
