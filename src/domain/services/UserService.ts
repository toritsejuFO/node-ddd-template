import { ID, Result } from 'types-ddd'

import UserRepository from '../repositories/UserRepository.interface'
import User from '../entities/user/User'
import UserService from './api/UserService.interface'
import { UserDtoCreate } from '../../app/dtos/UserDto'

export default class implements UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(userDto: UserDtoCreate): Promise<Result<User>> {
    const userAlreadyExists = await this.userRepository.existsByEmail(
      userDto.email
    )
    if (userAlreadyExists) {
      return Result.fail('User already exists')
    }

    const result = User.create({ ...userDto })
    return result
  }
}
