import { RESOLVER } from 'awilix'
import { IAdapter, ID, Result } from 'types-ddd'

import User from '@domain/entities/user/User'
import { IUserModel } from '@/app/repositories/IUserRepository'
import { UserDto } from '@app/dtos/UserDto'

export class ToDomainAdapter implements IAdapter<IUserModel, User> {
  static [RESOLVER] = {}

  build(userModel: IUserModel): Result<User> {
    const user = User.create({
      id: ID.create(userModel.userId),
      firstname: userModel.firstname,
      lastname: userModel.lastname,
      email: userModel.email,
      password: userModel.password,
      isEmailVerified: userModel.isEmailVerified,
      isActive: userModel.isActive,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt
    })

    return user
  }
}

export class ToPersistenceAdapter implements IAdapter<User, IUserModel> {
  static [RESOLVER] = {}

  build(user: User): Result<IUserModel> {
    const userObject = user.toObject()

    const userModel = {
      userId: userObject.id,
      firstname: userObject.firstname,
      lastname: userObject.lastname,
      email: userObject.email,
      password: userObject.password,
      isEmailVerified: userObject.isEmailVerified,
      isActive: userObject.isActive,
      createdAt: userObject.createdAt,
      updatedAt: userObject.updatedAt
    }

    return Result.Ok(userModel)
  }
}

export class ToDtoAdapter implements IAdapter<User, UserDto> {
  static [RESOLVER] = {}

  build(user: User): Result<UserDto> {
    const userObject = user.toObject()

    const userDto = {
      id: userObject.id,
      firstname: userObject.firstname,
      lastname: userObject.lastname,
      email: userObject.email,
      isEmailVerified: Boolean(userObject.isEmailVerified).valueOf(),
      isActive: Boolean(userObject.isActive).valueOf(),
      createdAt: userObject.createdAt,
      updatedAt: userObject.updatedAt
    }

    return Result.Ok(userDto)
  }
}
