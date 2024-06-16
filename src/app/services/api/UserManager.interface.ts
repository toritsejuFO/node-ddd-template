import { Result } from 'types-ddd'
import {
  UserDtoCreate,
  UserDto,
  LoginDto,
  ActivateAccountDto
} from '../../dtos/UserDto'

export default interface UserManager {
  getAllUsers(): Promise<Result<UserDto[]>>
  registerUser(userDto: UserDtoCreate): Promise<Result<UserDto | void>>
  login(loginDto: LoginDto): Promise<Result<string | void>>
  getUserById(id: string): Promise<Result<UserDto | void>>
  activateAccount(
    activateAccountDto: ActivateAccountDto
  ): Promise<Result<string>>
}
