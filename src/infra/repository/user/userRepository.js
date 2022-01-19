const { DatabaseException } = require('../../../shared/exceptions')

class UserRepository {
  #User

  constructor({ User, logger }) {
    this.logger = logger
    this.#User = User
  }

  async findAll() {
    try {
      return await this.#User.findAll()
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseException('Error fetching users from DB')
    }
  }

  async findOneBy(params) {
    try {
      return await this.#User.findOne({ where: params })
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseException(
        `Error fetching users from DB with params - ${JSON.stringify(params)}`
      )
    }
  }
}

module.exports = UserRepository
