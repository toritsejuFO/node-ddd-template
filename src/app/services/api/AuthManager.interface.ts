import { Result } from 'types-ddd'

import { LoginDto } from '../../dtos/AuthDto'

export default interface AuthManager {
  login(loginDto: LoginDto): Promise<Result<string | void>>
}
