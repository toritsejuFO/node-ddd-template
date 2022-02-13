const Login = require('../../domain/auth/Login')
const { ValidationError } = require('../../shared/errors')

class AuthManagementService {
  #userRepository
  #encryptionService
  #jwtService

  constructor({
    repository: { userRepository },
    encryptionService,
    jwtService
  }) {
    this.#userRepository = userRepository
    this.#encryptionService = encryptionService
    this.#jwtService = jwtService
  }

  async login(loginParams) {
    const { email, password } = loginParams
    const login = new Login({ email, password })

    let { valid, errors } = login.validate()
    if (!valid) {
      throw new ValidationError('Email or password not provided', errors)
    }

    const user = await this.#userRepository.findOneBy({ email: login.email })
    if (!user) {
      throw new ValidationError('Email or password is invalid')
    }

    valid = this.#encryptionService.compare(login.password, user.password)
    if (!valid) {
      throw new ValidationError('Email or password is invalid')
    }

    const authToken = this.#jwtService.encode(user.tokenizablePayload())
    return authToken
  }
}

module.exports = AuthManagementService
