import { IAdapter } from 'types-ddd'

import DatabaseError from '@shared/errors/DatabaseError'
import Database from '@infra/database'
import { Logger } from '@shared/logger'
import UserRepository, {
  UserModel
} from '@/app/repositories/UserRepository.interface'
import User from '@domain/entities/user/User'

export default class implements UserRepository {
  private readonly user: any

  constructor(
    private readonly database: Database,
    private readonly logger: Logger,
    private readonly toDomainAdapter: IAdapter<UserModel, User>,
    private readonly toPersistenceAdapter: IAdapter<User, UserModel>
  ) {
    this.user = this.database.connection.models.User
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.user.findAll()
      return users.map((user: UserModel) =>
        this.toDomainAdapter.build(user).value()
      )
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseError('Error fetching users from DB')
    }
  }

  private async findOneByParams(params: object): Promise<User | null> {
    try {
      const user: UserModel = await this.user.findOne({ where: params })
      if (!user) return null
      return this.toDomainAdapter.build(user).value()
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseError(
        'Error fetching users from DB using params: ' + JSON.stringify(params)
      )
    }
  }

  async findOneById(userId: string): Promise<User | null> {
    return this.findOneByParams({ userId })
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.findOneByParams({ email })
  }

  private async existsByParams(params: object): Promise<boolean> {
    try {
      const count = await this.user.count({ where: params })
      return count === 1
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseError('Error performing count operation')
    }
  }

  async existsById(userId: string): Promise<boolean> {
    return this.existsByParams({ userId })
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.existsByParams({ email })
  }

  async save(user: User): Promise<User> {
    try {
      const userModel: UserModel = this.toPersistenceAdapter.build(user).value()
      let savedUser

      if (await this.existsById(userModel.userId)) {
        savedUser = await this.user.update(userModel, {
          where: { userId: userModel.userId }
        })
        return user
      } else {
        savedUser = await this.user.create(userModel)
      }

      return this.toDomainAdapter.build(savedUser).value()
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseError('Failed to persist user to DB')
    }
  }

  async findOneByIdAndEmail(
    userId: string,
    email: string
  ): Promise<User | null> {
    try {
      return this.findOneByParams({ userId, email })
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseError('Error fetching user from DB')
    }
  }
}
