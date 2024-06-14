export default interface JwtService {
  encode(payload: any, options?: any): string
  verify(token: string, options?: any): any
}
