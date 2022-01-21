const BaseException = require('./BaseException')

class DatabaseException extends BaseException {}

class ValidationError extends BaseException {
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
  DatabaseException,
  ValidationError,
  isOfType,
  isOfAny
}
