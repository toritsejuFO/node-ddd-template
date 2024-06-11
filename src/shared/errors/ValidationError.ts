import BaseError from './BaseError'

export default class ValidationError extends BaseError {
  error: object | undefined

  constructor(message: string, error?: object) {
    super(message)
    this.error = error
  }
}
