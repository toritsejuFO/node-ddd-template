import jwt from 'jsonwebtoken'

import { Config } from '../config'

export interface JWT {
  encode(payload: any, options?: any): string
  verify(token: string, options?: any): any
}
export default class implements JWT {
  constructor(private readonly config: Config) {}

  encode(payload: any, options = {}) {
    return jwt.sign(payload, this.config.jwt.secret, options)
  }

  verify(token: string, options = {}) {
    return jwt.verify(token, this.config.jwt.secret, options)
  }
}
