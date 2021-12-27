class UserRepository {
  constructor({ User }) {
    this.User = User
  }

  async findAll() {
    return await this.User.findAll()
  }
}

module.exports = UserRepository
