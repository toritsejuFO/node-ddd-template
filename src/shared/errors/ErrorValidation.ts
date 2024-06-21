import BaseError from '@shared/errors/BaseError'
import DatabaseError from '@shared/errors/DatabaseError'

declare type CustomErrorType = BaseError | DatabaseError

export const isOfType = (runtimeError: CustomErrorType, error: string) => {
  return runtimeError?.constructor?.name === error
}

export const isOfAny = (
  runtimeError: CustomErrorType,
  errorArray: string[]
) => {
  return errorArray.some((type) => isOfType(runtimeError, type))
}
