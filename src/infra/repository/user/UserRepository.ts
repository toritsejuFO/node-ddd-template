import DatabaseError from '../../../shared/errors/DatabaseError'
import UserMapper from './UserMapper'
import Database from '../../database'
import { Logger } from '../../logger'
import UserRepository from '../../../domain/repository/UserRepository.interface'

export default class implements UserRepository {
  private readonly user: any

  constructor(
    private readonly database: Database,
    private readonly logger: Logger
  ) {
    // logger.info('UserRepository instantiated')
    // logger.info(database.instance.models)
    this.user = this.database.instance.models.User
  }

  async findAll() {
    try {
      const users = await this.user.findAll()
      return users.map(UserMapper.toEntity)
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseError('Error fetching users from DB')
    }
  }

  async findOneBy(params: any) {
    try {
      const user = await this.user.findOne({ where: params })
      return UserMapper.toEntity(user)
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseError('Error fetching users from DB with params')
    }
  }

  async existsBy(params: any) {
    try {
      return await this.user.count(params)
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseError('Error performing count operation')
    }
  }

  async create(user: any) {
    try {
      const dbUser = await this.user.create(user.toJSON())
      return UserMapper.toEntity(dbUser)
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseError('Failed to persist user to DB')
    }
  }
}
