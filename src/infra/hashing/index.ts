import { hashSync, compareSync } from 'bcrypt'
import HashService from '@app/services/api/HashService.interface'

export default class implements HashService {
  private readonly SALT = 10

  hash(value: string) {
    return hashSync(value, this.SALT)
  }

  compare(value: string, encryptedValue: string) {
    return compareSync(value, encryptedValue)
  }
}
