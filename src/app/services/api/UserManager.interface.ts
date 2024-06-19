import { Result } from 'types-ddd'
import {
  NewUserDto,
  UserDto,
  LoginDto,
  ActivateAccountDto
} from '@app/dtos/UserDto'

export default interface UserManager {
  getAllUsers(): Promise<Result<UserDto[]>>
  registerUser(userDto: NewUserDto): Promise<Result<UserDto | void>>
  login(loginDto: LoginDto): Promise<Result<string | void>>
  getUserById(id: string): Promise<Result<UserDto | void>>
  activateAccount(
    activateAccountDto: ActivateAccountDto
  ): Promise<Result<string>>
}
