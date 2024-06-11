export default interface AuthManager {
  userRepository: any
  encryptionService: any
  jwtService: any

  login(loginParams: any): Promise<any>
}
