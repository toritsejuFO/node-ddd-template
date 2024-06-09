import BaseError from './BaseError'
import ValidationError from './ValidationError'
import DatabaseError from './DatabaseError'

declare type CustomErrorType = BaseError | ValidationError | DatabaseError

export const isOfType = (runtimeError: CustomErrorType, error: string) => {
  return runtimeError?.constructor?.name === error
}

export const isOfAny = (
  runtimeError: CustomErrorType,
  errorArray: string[]
) => {
  return errorArray.some((type) => isOfType(runtimeError, type))
}
