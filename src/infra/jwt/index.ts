import jwt from 'jsonwebtoken'

import { Config } from '@shared/config'
import { IJwtService } from '@/app/services/IJwtService'

export class JwtService implements IJwtService {
  constructor(private readonly config: Config) {}

  encode(payload: object, options = {}) {
    return jwt.sign(payload, this.config.jwt.secret, options)
  }

  verify(token: string, options = {}) {
    return jwt.verify(token, this.config.jwt.secret, options)
  }
}
