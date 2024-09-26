import { Result } from 'types-ddd'

import {
  NewUserDto,
  UserDto,
  LoginDto,
  ActivateAccountDto
} from '@app/dtos/UserDto'
import { User } from '@/domain/entities/user/User'
import { IPageable } from '@/shared/utils/IPageable'
import { PageRequest } from '@app/dtos/PageRequestDto'

export interface IUserManager {
  getAllUsers(pageRequest: PageRequest): Promise<Result<IPageable<UserDto>>>
  registerUser(userDto: NewUserDto): Promise<Result<UserDto | void>>
  login(loginDto: LoginDto): Promise<Result<{ token: string } | void>>
  getCurrentUser(user: User): Promise<Result<UserDto | void>>
  getUserById(id: string): Promise<Result<UserDto | void>>
  activateAccount(
    activateAccountDto: ActivateAccountDto
  ): Promise<Result<string | void>>
}
