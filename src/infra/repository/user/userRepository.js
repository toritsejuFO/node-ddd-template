const { DatabaseException } = require('../../../shared/exceptions')
const UserMapper = require('./userMapper')

class UserRepository {
  #User

  constructor({ User, logger }) {
    this.logger = logger
    this.#User = User
  }

  async findAll() {
    try {
      const users = await this.#User.findAll()
      return users.map(UserMapper.toEntity)
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseException('Error fetching users from DB')
    }
  }

  async findOneBy(params) {
    try {
      const user = await this.#User.findOne({ where: params })
      UserMapper.toEntity(user)
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseException('Error fetching users from DB with params')
    }
  }

  async existsBy(params) {
    try {
      return await this.#User.count(params)
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseException('Error performing count operation')
    }
  }

  async create(user) {
    try {
      const dbUser = await this.#User.create(user.toJSON())
      return UserMapper.toEntity(dbUser)
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseException('Failed to persist user to DB')
    }
  }
}

module.exports = UserRepository
