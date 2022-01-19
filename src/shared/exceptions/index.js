const BaseException = require('./BaseException')

class DatabaseException extends BaseException {}

class LoginParametersNotProvided extends BaseException {
  constructor(error) {
    super('Email or password not provided')
    this.error = error
  }
}

class InvalidLoginParameters extends BaseException {
  constructor(message) {
    super(message || 'Email or password is invalid')
  }
}

module.exports = {
  DatabaseException,
  LoginParametersNotProvided,
  InvalidLoginParameters
}
