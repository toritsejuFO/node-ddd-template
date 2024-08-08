export default interface HashService {
  hash(value: string): string
  compare(value: string, encryptedValue: string): boolean
}
