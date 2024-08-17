import { IAdapter, Result } from 'types-ddd'

import UserRepository from '@/app/repositories/interface/UserRepository.interface'
import User from '@domain/entities/user/User'
import UserManager from '@/app/services/interface/UserManager.interface'
import NewUserCreatedEvent from '@domain/events/NewUserCreatedEvent'
import HashService from '@/app/services/interface/HashService.interface'
import EventPublisher from '@/domain/events/interface/EventPublisher.interface'
import {
  NewUserDto,
  UserDto,
  LoginDto,
  ActivateAccountDto
} from '@app/dtos/UserDto'
import JwtService from '@/app/services/interface/JwtService.interface'
import MESSAGE from '@/app/messaging/UserMessage'
import { Logger } from '@/shared/logger'

export default class implements UserManager {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly hashService: HashService,
    private readonly toDtoAdapter: IAdapter<User, UserDto>,
    private readonly jwtService: JwtService,
    protected readonly logger: Logger
  ) {}

  async getAllUsers() {
    const users = await this.userRepository.findAll()
    const userDtoList = users
      .map(this.toDtoAdapter.build)
      .map((result) => result.value())
    return Result.Ok(userDtoList, MESSAGE.USERS_FETCHED_SUCCESSFULLY)
  }

  async registerUser(userDto: NewUserDto) {
    if (await this.userRepository.existsByEmail(userDto.email)) {
      return Result.fail(MESSAGE.USER_ALREADY_EXISTS)
    }

    const result = User.create(userDto)
    if (result.isFail()) {
      return Result.fail(result.error() || MESSAGE.USER_REGISTRATION_FAILED)
    }

    const user = result.value()
    user.change('password', this.hashService.hash(user.get('password')))
    const savedUser = await this.userRepository.save(user)

    this.eventPublisher.publishEvent(new NewUserCreatedEvent(savedUser))

    const retUserDto = this.toDtoAdapter.build(savedUser).value()
    return Result.Ok(retUserDto, MESSAGE.USER_REGISTERED_SUCCESSFULLY)
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    const user = await this.userRepository.findOneByEmail(email)
    if (!(user && this.hashService.compare(password, user.get('password')))) {
      return Result.fail(MESSAGE.INVALID_LOGIN)
    }

    const result = user.login()
    if (result.isFail()) {
      return Result.fail(result.error() || MESSAGE.LOGIN_FAILED)
    }

    const authToken = this.jwtService.encode(user.getLoginTokenPayload())
    return Result.Ok({ token: authToken }, MESSAGE.LOGIN_SUCCESSFUL)
  }

  async getCurrentUser(user: User) {
    const userDto = this.toDtoAdapter.build(user).value()
    return Result.Ok(userDto, MESSAGE.USER_FETCHED_SUCCESSFULLY)
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOneById(id)
    if (!user) {
      return Result.fail(MESSAGE.USER_NOT_FOUND)
    }

    const userDto = this.toDtoAdapter.build(user).value()
    return Result.Ok(userDto, MESSAGE.USER_FETCHED_SUCCESSFULLY)
  }

  async activateAccount(activateAccountDto: ActivateAccountDto) {
    const { token } = activateAccountDto
    const { email, id, activate } = this.jwtService.verify(token)
    let userDto

    const user = await this.userRepository.findOneByIdAndEmail(id, email)
    if (!(user && activate)) {
      return Result.fail(MESSAGE.INVALID_TOKEN)
    }

    if (user.isActive()) {
      userDto = this.toDtoAdapter.build(user).value()
      return Result.Ok(MESSAGE.USER_ALREADY_ACTIVATED)
    }

    user.activate()
    const savedUser = await this.userRepository.save(user)
    userDto = this.toDtoAdapter.build(savedUser).value()
    return Result.Ok(MESSAGE.USER_ACTIVATED)
  }
}
