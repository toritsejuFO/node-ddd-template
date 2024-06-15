import { Entity, Result, UID } from 'types-ddd'

interface UserProps {
  id?: UID
  firstname: string
  lastname: string
  email: string
  password: string
  isEmailVerified?: boolean
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export default class User extends Entity<UserProps> {
  private constructor(userProps: UserProps) {
    super(userProps)
  }

  public static create(userProps: UserProps): Result<User> {
    return Result.Ok(new User(userProps))
  }

  tokenizablePayload() {
    return { email: this.props.email, id: this.props.id?.value() }
  }

  activate() {
    if (!this.props.isEmailVerified) {
      this.props.isEmailVerified = true
    }
    this.props.isActive = true
  }

  isActive() {
    return this.props.isActive
  }
}
