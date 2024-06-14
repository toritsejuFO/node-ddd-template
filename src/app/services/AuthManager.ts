import { Result } from 'types-ddd'

import UserRepository from '../../domain/repositories/UserRepository.interface'
import AuthManager from './api/AuthManager.interface'
import EncryptionService from './api/EncryptionService.interface'
import JwtService from './api/JwtService.interface'
import { LoginDto } from '../dtos/AuthDto'

export default class implements AuthManager {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService
  ) {}

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
}
