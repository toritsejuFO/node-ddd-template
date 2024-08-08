import { IAdapter } from 'types-ddd'

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
import {
  INVALID_LOGIN,
  INVALID_TOKEN,
  USER_ACTIVATED,
  USER_ALREADY_ACTIVATED,
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND
} from '@/app/messaging/UserMessage'
import BaseManager from '@app/services/BaseManager'
import { Logger } from '@/shared/logger'

export default class extends BaseManager implements UserManager {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly hashService: HashService,
    private readonly toDtoAdapter: IAdapter<User, UserDto>,
    private readonly jwtService: JwtService,
    protected readonly logger: Logger
  ) {
    super(logger)
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll()
    const userDtoList = users
      .map(this.toDtoAdapter.build)
      .map((result) => result.value())
    return this.ok(userDtoList)
  }

  async registerUser(userDto: NewUserDto) {
    if (await this.userRepository.existsByEmail(userDto.email)) {
      return this.fail(USER_ALREADY_EXISTS)
    }

    const result = User.create(userDto)
    if (result.isFail()) return result

    const user = result.value()
    user.change('password', this.hashService.hash(user.get('password')))
    const savedUser = await this.userRepository.save(user)

    this.eventPublisher.publishEvent(new NewUserCreatedEvent(savedUser))

    const retUserDto = this.toDtoAdapter.build(savedUser).value()
    return this.ok(retUserDto)
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    const user = await this.userRepository.findOneByEmail(email)
    if (!(user && this.hashService.compare(password, user.get('password')))) {
      return this.fail(INVALID_LOGIN)
    }

    const result = user.login()
    if (result.isFail()) return result

    const authToken = this.jwtService.encode(user.getLoginTokenPayload())
    return this.ok({ token: authToken })
  }

  async getCurrentUser(user: User) {
    return this.ok(this.toDtoAdapter.build(user).value())
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOneById(id)
    if (!user) return this.fail(USER_NOT_FOUND)
    return this.ok(this.toDtoAdapter.build(user).value())
  }

  async activateAccount(activateAccountDto: ActivateAccountDto) {
    const { token } = activateAccountDto
    const { email, id, activate } = this.jwtService.verify(token)

    const user = await this.userRepository.findOneByIdAndEmail(id, email)
    if (!(user && activate)) {
      return this.fail(INVALID_TOKEN)
    }

    if (user.isActive()) {
      return this.ok(USER_ALREADY_ACTIVATED)
    }

    user.activate()
    await this.userRepository.save(user)
    return this.ok(USER_ACTIVATED)
  }
}
