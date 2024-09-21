import { IAdapter, Result } from 'types-ddd'

import { IUserRepository } from '@/app/repositories/IUserRepository'
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
import USER_MESSAGE from '@/app/messaging/UserMessage'
import { Logger } from '@/shared/logger'
import { PageRequest } from '@app/dtos/PageRequestDto'

const {
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND,
  INVALID_LOGIN,
  INVALID_TOKEN,
  USER_ACTIVATED,
  USER_ALREADY_ACTIVATED,
  USERS_FETCHED_SUCCESSFULLY,
  USER_FETCHED_SUCCESSFULLY,
  USER_REGISTERED_SUCCESSFULLY,
  USER_REGISTRATION_FAILED,
  LOGIN_SUCCESSFUL,
  LOGIN_FAILED
} = USER_MESSAGE

export default class implements UserManager {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly hashService: HashService,
    private readonly toDtoAdapter: IAdapter<User, UserDto>,
    private readonly jwtService: JwtService,
    protected readonly logger: Logger
  ) {}

  async getAllUsers(pageRequest: PageRequest) {
    const pageable = await this.userRepository.findAll(pageRequest)

    const userDtoList = pageable.data.map((user) =>
      this.toDtoAdapter.build(user).value()
    )
    const response = Object.assign(pageable, { data: userDtoList })

    return Result.Ok(response, USERS_FETCHED_SUCCESSFULLY)
  }

  async registerUser(userDto: NewUserDto) {
    if (await this.userRepository.existsByEmail(userDto.email)) {
      return Result.fail(USER_ALREADY_EXISTS)
    }

    const result = User.create(userDto)
    if (result.isFail()) {
      return Result.fail(result.error() || USER_REGISTRATION_FAILED)
    }

    const user = result.value()
    user.change('password', this.hashService.hash(user.get('password')))
    const savedUser = await this.userRepository.save(user)

    this.eventPublisher.publishEvent(new NewUserCreatedEvent(savedUser))

    const retUserDto = this.toDtoAdapter.build(savedUser).value()
    return Result.Ok(retUserDto, USER_REGISTERED_SUCCESSFULLY)
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    const user = await this.userRepository.findOneByEmail(email)
    if (!(user && this.hashService.compare(password, user.get('password')))) {
      return Result.fail(INVALID_LOGIN)
    }

    const result = user.login()
    if (result.isFail()) {
      return Result.fail(result.error() || LOGIN_FAILED)
    }

    const authToken = this.jwtService.encode(user.getLoginTokenPayload())
    return Result.Ok({ token: authToken }, LOGIN_SUCCESSFUL)
  }

  async getCurrentUser(user: User) {
    const userDto = this.toDtoAdapter.build(user).value()
    return Result.Ok(userDto, USER_FETCHED_SUCCESSFULLY)
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOneById(id)
    if (!user) {
      return Result.fail(USER_NOT_FOUND)
    }

    const userDto = this.toDtoAdapter.build(user).value()
    return Result.Ok(userDto, USER_FETCHED_SUCCESSFULLY)
  }

  async activateAccount(activateAccountDto: ActivateAccountDto) {
    const { token } = activateAccountDto
    const { email, id, activate } = this.jwtService.verify(token)

    const user = await this.userRepository.findOneByIdAndEmail(id, email)
    if (!(user && activate)) {
      return Result.fail(INVALID_TOKEN)
    }

    if (user.isActive()) {
      return Result.Ok(USER_ALREADY_ACTIVATED)
    }

    user.activate()
    await this.userRepository.save(user)
    return Result.Ok(USER_ACTIVATED)
  }
}
