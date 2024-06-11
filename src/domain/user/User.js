const { attributes } = require('structure')

const User = attributes({
  userId: {
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
})(
  class User {
    serialize() {
      const user = this.toJSON()
      delete user.password
      return user
    }

    tokenizablePayload() {
      return { email: this.email, userId: this.userId }
    }
  }
)

module.exports = User
