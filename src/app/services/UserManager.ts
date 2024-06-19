import { IAdapter, Result } from 'types-ddd'

import UserRepository from '@/app/repositories/UserRepository.interface'
import User from '@domain/entities/user/User'
import UserManager from '@app/services/api/UserManager.interface'
import NewUserCreatedEvent from '@domain/events/NewUserCreatedEvent'
import HashService from '@app/services/api/HashService.interface'
import EventPublisher from '@domain/events/EventPublisher.interface'
import {
  NewUserDto,
  UserDto,
  LoginDto,
  ActivateAccountDto
} from '@app/dtos/UserDto'
import JwtService from '@/app/services/api/JwtService.interface'

export default class implements UserManager {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly hashService: HashService,
    private readonly toDtoAdapter: IAdapter<User, UserDto>,
    private readonly jwtService: JwtService
  ) {}

  async getAllUsers() {
    const users = await this.userRepository.findAll()
    const userDtoList = users
      .map(this.toDtoAdapter.build)
      .map((result) => result.value())
    return Result.Ok(userDtoList)
  }

  async registerUser(userDto: NewUserDto) {
    if (await this.userRepository.existsByEmail(userDto.email)) {
      return Result.fail('User already exists')
    }

    const result = User.create(userDto)
    if (result.isFail()) {
      return Result.fail(result.error(), result.metaData())
    }

    const user = result.value()
    user.change('password', this.hashService.hash(user.get('password')))
    const savedUser = await this.userRepository.save(user)

    this.eventPublisher.publishEvent(new NewUserCreatedEvent(savedUser))

    const retUserDto = this.toDtoAdapter.build(savedUser).value()
    return Result.Ok(retUserDto)
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    const user = await this.userRepository.findOneByEmail(email)
    if (!(user && this.hashService.compare(password, user.get('password')))) {
      return Result.fail('Invalid email or password')
    }

    const result = user.login()
    if (result.isFail()) {
      return result
    }

    const authToken = this.jwtService.encode(user.getLoginTokenPayload())
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
    if (!(user && activate)) {
      return Result.fail('Invalid token received')
    }

    if (user.isActive()) {
      return Result.Ok('User account is already active')
    }

    user.activate()
    await this.userRepository.save(user)
    return Result.Ok('User account activated successfully')
  }
}
