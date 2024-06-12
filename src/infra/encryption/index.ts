import { hashSync, compareSync } from 'bcrypt'

export interface Encryption {
  encrypt(value: string): string
  compare(value: string, encryptedValue: string): boolean
}

export default class implements Encryption {
  private readonly SALT = 10

  encrypt(value: string) {
    return hashSync(value, this.SALT)
  }

  compare(value: string, encryptedValue: string) {
    return compareSync(value, encryptedValue)
  }
}
