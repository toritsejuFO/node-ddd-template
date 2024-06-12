import Login from '../../domain/auth/Login'
import UserRepository from '../../domain/repository/UserRepository.interface'
import { Encryption } from '../../infra/encryption'
import { JWT } from '../../infra/jwt'
import ValidationError from '../../shared/errors/ValidationError'
import AuthManager from './api/AuthManager.interface'

export default class implements AuthManager {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: Encryption,
    private readonly jwtService: JWT
  ) {}

  async login(loginParams: any) {
    const { email, password } = loginParams
    const login = new Login({ email, password })

    let { valid, errors } = login.validate()
    if (!valid) {
      throw new ValidationError('Email or password not provided', errors)
    }

    const user = await this.userRepository.findOneBy({ email: login.email })
    if (!user) {
      throw new ValidationError('Email or password is invalid')
    }

    valid = this.encryptionService.compare(login.password, user.password)
    if (!valid) {
      throw new ValidationError('Email or password is invalid')
    }

    const authToken = this.jwtService.encode(user.tokenizablePayload())
    return authToken
  }
}
