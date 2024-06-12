export default interface AuthManager {
  login(loginParams: any): Promise<any>
}
