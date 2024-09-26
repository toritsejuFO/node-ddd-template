export interface IJwtService {
  encode(payload: object, options?: object): string
  verify(token: string, options?: object): any
}
