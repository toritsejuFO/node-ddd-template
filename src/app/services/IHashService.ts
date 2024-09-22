export interface IHashService {
  hash(value: string): string
  compare(value: string, encryptedValue: string): boolean
}
