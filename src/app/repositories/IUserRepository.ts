import User from '@domain/entities/user/User'
import { IPageable } from '@shared/utils/IPageable'
import { PageRequest } from '@app/dtos/PageRequestDto'

export interface IUserModel {
  userId: string
  firstname: string
  lastname: string
  email: string
  password: string
  isEmailVerified?: boolean
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IUserRepository {
  findAll(pageRequest: PageRequest): Promise<IPageable<User>>
  findAllBy(where: any, pageRequest: PageRequest): Promise<IPageable<User>>
  findOneById(userId: string): Promise<User | null>
  findOneByEmail(email: string): Promise<User | null>
  existsById(userId: string): Promise<boolean>
  existsByEmail(email: string): Promise<boolean>
  findOneByIdAndEmail(userId: string, email: string): Promise<User | null>
  save(user: User): Promise<User>
}
