import User from '../entities/user/User'

export interface UserModel {
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

export default interface UserRepository {
  findAll(): Promise<User[]>
  findOneById(userId: string): Promise<User | null>
  findOneByEmail(email: string): Promise<User | null>
  existsById(userId: string): Promise<boolean>
  existsByEmail(email: string): Promise<boolean>
  findOneByIdAndEmail(userId: string, email: string): Promise<User | null>
  save(user: User): Promise<User>
}
