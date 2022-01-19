const bcrypt = require('bcrypt')

class Encryption {
  static encrypt(value) {
    return bcrypt.hashSync(value)
  }

  static compare(value, encryptedValue) {
    return bcrypt.compareSync(value, encryptedValue)
  }
}

module.exports = Encryption
