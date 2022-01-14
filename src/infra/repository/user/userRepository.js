const DatabaseException = require('../../../shared/exceptions/DatabaseException')

class UserRepository {
  constructor({ User }) {
    this.User = User
  }

  async findAll() {
    try {
      return await this.User.findAll()
    } catch (error) {
      throw new DatabaseException('Error fetching users from DB')
    }
  }
}

module.exports = UserRepository
