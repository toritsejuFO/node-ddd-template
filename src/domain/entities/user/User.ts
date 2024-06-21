import { Entity, Result, UID } from 'types-ddd'

export interface UserProps {
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

  getLoginTokenPayload() {
    return { email: this.props.email, id: this.id.value() }
  }

  getActivateTokenPayload() {
    return {
      email: this.props.email,
      id: this.id?.value(),
      activate: true
    }
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

  login() {
    if (!this.isActive()) {
      return Result.fail('Account not active')
    }
    return Result.Ok()
  }
}
