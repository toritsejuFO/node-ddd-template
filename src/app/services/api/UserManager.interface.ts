import { Result } from 'types-ddd'
import { UserDtoCreate, UserDto } from '../../dtos/UserDto'
import { LoginDto } from '../../dtos/AuthDto'

export default interface UserManager {
  getAllUsers(): Promise<Result<UserDto[]>>
  createANewUser(userDto: UserDtoCreate): Promise<Result<UserDto | void>>
  login(loginDto: LoginDto): Promise<Result<string | void>>
  getUserById(userId: string): Promise<Result<UserDto | void>>
}
