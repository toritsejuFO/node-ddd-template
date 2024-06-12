import { Logger } from '../../infra/logger'

export default interface UserRepository {
  findAll(): Promise<any[]>
  findOneBy(params: any): Promise<any>
  existsBy(params: any): Promise<number>
  create(user: any): Promise<any>
}
