import { Result } from 'types-ddd'

import User from '@entities/user/User'
import { UserDtoCreate } from '@app/dtos/UserDto'

export default interface UserService {
  registerUser(userDto: UserDtoCreate): Promise<Result<User>>
}
