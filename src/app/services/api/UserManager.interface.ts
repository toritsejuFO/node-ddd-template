import { Result } from 'types-ddd'
import { UserDtoCreate, UserDto } from '../../dtos/UserDto'

export default interface UserManager {
  getAllUsers(): Promise<Result<UserDto[]>>
  createANewUser(userDto: UserDtoCreate): Promise<Result<UserDto | void>>
  getUserById(userId: string): Promise<Result<UserDto | void>>
}
