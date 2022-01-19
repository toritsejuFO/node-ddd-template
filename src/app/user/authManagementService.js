const Login = require('../../domain/auth/Login')
const {
  LoginParametersNotProvided,
  InvalidLoginParameters
} = require('../../shared/exceptions')

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
      throw new LoginParametersNotProvided(errors)
    }

    const user = await this.#userRepository.findOneBy({ email: login.email })
    if (!user) {
      throw new InvalidLoginParameters()
    }

    valid = this.#encryptionService.compare(login.password, user.password)
    if (!valid) {
      throw new InvalidLoginParameters()
    }

    const payload = { email: user.email, userId: user.id }
    const authToken = this.#jwtService.encode(payload)

    return authToken
  }
}

module.exports = AuthManagementService