import jwt from 'jsonwebtoken'

import { Config } from '../config'
import JwtService from '../../app/services/api/JwtService.interface'

export default class implements JwtService {
  constructor(private readonly config: Config) {}

  encode(payload: object, options = {}) {
    return jwt.sign(payload, this.config.jwt.secret, options)
  }

  verify(token: string, options = {}) {
    return jwt.verify(token, this.config.jwt.secret, options)
  }
}
