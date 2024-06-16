import { IAdapter, Result } from 'types-ddd'

import UserRepository from '../../domain/repositories/UserRepository.interface'
import User from '../../domain/entities/user/User'
import UserManager from './api/UserManager.interface'
import NewUserCreatedEvent from '../../domain/events/NewUserCreatedEvent'
import UserService from '../../domain/services/api/UserService.interface'
import EncryptionService from './api/EncryptionService.interface'
import EventPublisher from '../../domain/events/EventPublisher.interface'
import {
  UserDtoCreate,
  UserDto,
  LoginDto,
  ActivateAccountDto
} from '../dtos/UserDto'
import JwtService from './api/JwtService.interface'

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

  async registerUser(userDto: UserDtoCreate) {
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
    const activationToken = this.jwtService.encode(user.activateTokenPayload())
    this.eventPublisher.publishEvent(
      new NewUserCreatedEvent({ ...retUserDto, activationToken })
    )
    return Result.Ok(retUserDto)
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    const user = await this.userRepository.findOneByEmail(email)
    if (!user) {
      return Result.fail('Invalid email or password')
    }

    const valid = this.encryptionService.compare(password, user.get('password'))
    if (!valid) {
      return Result.fail('Invalid email or password')
    }

    if (!user.isActive()) {
      return Result.fail('Account not activated')
    }

    const authToken = this.jwtService.encode(user.loginTokenPayload())
    return Result.Ok(authToken)
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOneById(id)
    if (!user) return Result.fail('User not found')
    return Result.Ok(this.toDtoAdapter.build(user).value())
  }

  async activateAccount(
    activateAccountDto: ActivateAccountDto
  ): Promise<Result<string>> {
    const { token } = activateAccountDto
    const { email, id, activate } = this.jwtService.verify(token)

    const user = await this.userRepository.findOneByIdAndEmail(id, email)
    if (!user || !activate) return Result.fail('Invalid token received')

    if (!user.isActive()) {
      user.activate()
      await this.userRepository.save(user)
    }

    return Result.Ok('Account activated successfully')
  }
}
