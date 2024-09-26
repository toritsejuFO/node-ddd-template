import { IAdapter } from 'types-ddd'
import { RESOLVER } from 'awilix'

import { DatabaseError } from '@shared/errors/DatabaseError'
import { Database } from '@infra/database'
import { Logger } from '@shared/logger'
import { IUserRepository, IUserModel } from '@/app/repositories/IUserRepository'
import { User } from '@domain/entities/user/User'
import { IPageable } from '@/shared/utils/IPageable'
import { RepositoryHelper } from '@infra/repositories/RepositoryHelper'
import { PageRequest } from '@app/dtos/PageRequestDto'

export class UserRepository implements IUserRepository {
  static [RESOLVER] = {}

  private readonly repositoryHelper: RepositoryHelper<IUserModel>

  constructor(
    private readonly database: Database,
    private readonly logger: Logger,
    private readonly toDomainAdapter: IAdapter<IUserModel, User>,
    private readonly toPersistenceAdapter: IAdapter<User, IUserModel>
  ) {
    this.repositoryHelper = new RepositoryHelper<IUserModel>(
      this.database.client
    )
  }

  private async findOneByParams(params: any): Promise<User | null> {
    try {
      const user = (await this.database.client.users.findUnique({
        where: params
      })) as IUserModel | null
      if (!user) return null
      return this.toDomainAdapter.build(user).value()
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseError(
        'Error fetching users from DB using params: ' + JSON.stringify(params)
      )
    }
  }

  private async existsByParams(params: object): Promise<boolean> {
    try {
      const count = await this.database.client.users.count({ where: params })
      return count === 1
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseError('Error performing count operation')
    }
  }

  private async find(
    where: any,
    pageRequest: PageRequest
  ): Promise<IPageable<User>> {
    try {
      const pageable: IPageable<IUserModel> =
        await this.repositoryHelper.paginate(
          this.database.client.users,
          {},
          pageRequest
        )

      const data: IPageable<User> = Object.assign(pageable, {
        data: pageable.data.map((user) =>
          this.toDomainAdapter.build(user).value()
        )
      })

      return data
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseError('Error fetching users from DB')
    }
  }

  public async findAll(pageRequest: PageRequest): Promise<IPageable<User>> {
    return this.find({}, pageRequest)
  }

  public async findAllBy(
    where: any,
    pageRequest: PageRequest
  ): Promise<IPageable<User>> {
    return this.find(where, pageRequest)
  }

  public async findOneById(userId: string): Promise<User | null> {
    return this.findOneByParams({ userId })
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    return this.findOneByParams({ email })
  }

  public async existsById(userId: string): Promise<boolean> {
    return this.existsByParams({ userId })
  }

  public async existsByEmail(email: string): Promise<boolean> {
    return this.existsByParams({ email })
  }

  public async save(user: User): Promise<User> {
    try {
      const userModel = <IUserModel>(
        this.toPersistenceAdapter.build(user).value()
      )
      let savedUser

      if (await this.existsById(userModel.userId)) {
        savedUser = await this.database.client.users.update({
          where: { userId: userModel.userId },
          data: userModel
        })
        return user
      } else {
        savedUser = await this.database.client.users.create({
          data: userModel as any
        })
      }

      return this.toDomainAdapter.build(savedUser).value()
    } catch (error) {
      this.logger.error(error)
      throw new DatabaseError('Failed to persist user to DB')
    }
  }

  public async findOneByIdAndEmail(
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
