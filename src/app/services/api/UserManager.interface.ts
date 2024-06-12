interface NewUserParams {
  name: string
  email: string
}

interface User {
  name: string
  email: string
}

export default interface UserManager {
  getAllUsers(): Promise<User[]>
  createANewUser(newUserParams: NewUserParams): Promise<any>
  getUserById(userId: string): Promise<User>
}
