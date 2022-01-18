const DatabaseException = require('../../../shared/exceptions/DatabaseException')

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
}

module.exports = UserRepository
