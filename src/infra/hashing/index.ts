import HashService from '@/app/services/interface/HashService.interface'
import { randomBytes, scryptSync } from 'node:crypto'

export default class implements HashService {
  private readonly SALT = 10

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
