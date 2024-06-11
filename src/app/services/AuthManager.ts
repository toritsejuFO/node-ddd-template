import Login from '../../domain/auth/Login'
import UserRepository from '../../domain/repository/UserRepository'
import ValidationError from '../../shared/errors/ValidationError'
import AuthManager from './api/AuthManager'

export default class implements AuthManager {
  readonly userRepository
  readonly encryptionService
  readonly jwtService

  constructor(
    userRepository: UserRepository,
    encryptionService: any,
    jwtService: any
  ) {
    this.userRepository = userRepository
    this.encryptionService = encryptionService
    this.jwtService = jwtService
  }

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
