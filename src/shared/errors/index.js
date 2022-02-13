const BaseError = require('./BaseError')

class DatabaseError extends BaseError {}

class ValidationError extends BaseError {
  constructor(message, error) {
    super(message)
    if (error) {
      this.error = error
    }
  }
}

const isOfType = (error, type) => {
  return error && error.constructor && error.constructor.name === type
}

const isOfAny = (error, typeArray) => {
  return typeArray.some((type) => isOfType(error, type))
}

module.exports = {
  DatabaseError,
  ValidationError,
  isOfType,
  isOfAny
}
