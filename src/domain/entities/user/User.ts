import { Entity, Result, UID } from 'types-ddd'

interface UserProps {
  id?: UID
  firstname: string
  lastname: string
  email: string
  password: string
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

  public serialize() {
    return this.toObject()
  }

  tokenizablePayload() {
    return { email: this.props.email, id: this.props.id?.value() }
  }
}
