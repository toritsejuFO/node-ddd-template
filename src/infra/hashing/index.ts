import { randomBytes, scryptSync } from 'node:crypto'

import { IHashService } from '@/app/services/IHashService'

export class HashService implements IHashService {
  private generateSalt() {
    return randomBytes(16).toString('hex')
  }

  private encrypt(value: string, salt: string) {
    return scryptSync(value, salt, 32).toString('hex')
  }

  hash(value: string) {
    const salt = this.generateSalt()
    return this.encrypt(value, salt) + `$${salt}`
  }

  compare(value: string, encryptedValue: string) {
    const [hash, salt] = encryptedValue.split('$')
    return this.encrypt(value, salt) === hash
  }
}
