const { attributes } = require('structure')

const User = attributes({
  id: {
    type: String
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  }
})(class User {})

module.exports = User
