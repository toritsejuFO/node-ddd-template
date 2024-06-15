import { IAdapter, ID, Result } from 'types-ddd'

import User from '../entities/user/User'
import { UserModel } from '../repositories/UserRepository.interface'
import { UserDto } from '../../app/dtos/UserDto'

export class ToDomainAdapter implements IAdapter<UserModel, User> {
  build(userModel: UserModel): Result<User> {
    const user = User.create({
      id: ID.create(userModel.userId),
      firstname: userModel.firstname,
      lastname: userModel.lastname,
      email: userModel.email,
      password: userModel.password,
      createdAt: userModel.createdAt,
      updatedAt: userModel.updatedAt
    })

    return user
  }
}

export class ToPersistenceAdapter implements IAdapter<User, UserModel> {
  build(user: User): Result<UserModel> {
    const userObject = user.toObject()

    const userModel = {
      userId: userObject.id,
      firstname: userObject.firstname,
      lastname: userObject.lastname,
      email: userObject.email,
      password: userObject.password,
      createdAt: userObject.createdAt,
      updatedAt: userObject.updatedAt
    }

    return Result.Ok(userModel)
  }
}

export class ToDtoAdapter implements IAdapter<User, Omit<UserDto, 'password'>> {
  build(user: User): Result<Omit<UserDto, 'password'>> {
    const userObject = user.toObject()

    const userDto = {
      id: userObject.id,
      firstname: userObject.firstname,
      lastname: userObject.lastname,
      email: userObject.email,
      createdAt: userObject.createdAt,
      updatedAt: userObject.updatedAt
    }

    return Result.Ok(userDto)
  }
}