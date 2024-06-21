import { Result } from 'types-ddd'
import {
  NewUserDto,
  UserDto,
  LoginDto,
  ActivateAccountDto
} from '@app/dtos/UserDto'
import User from '@/domain/entities/user/User'

export default interface UserManager {
  getAllUsers(): Promise<Result<UserDto[]>>
  registerUser(userDto: NewUserDto): Promise<Result<UserDto | void>>
  login(loginDto: LoginDto): Promise<Result<{ token: string } | void>>
  getCurrentUser(user: User): Promise<Result<UserDto | void>>
  getUserById(id: string): Promise<Result<UserDto | void>>
  activateAccount(
    activateAccountDto: ActivateAccountDto
  ): Promise<Result<string>>
}
