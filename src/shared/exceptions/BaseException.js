class BaseException extends Error {
  constructor(message) {
    if (typeof message === 'object') {
      super(JSON.stringify(message))
    } else {
      super(message)
    }
  }
}

module.exports = BaseException
