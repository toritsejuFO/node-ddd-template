import { hashSync, compareSync } from 'bcrypt'
import EncryptionService from '../../app/services/api/EncryptionService.interface'

export default class implements EncryptionService {
  private readonly SALT = 10

  encrypt(value: string) {
    return hashSync(value, this.SALT)
  }

  compare(value: string, encryptedValue: string) {
    return compareSync(value, encryptedValue)
  }
}
