const bcrypt = require('bcrypt')

class Encryption {
  #SALT = 10

  encrypt(value) {
    return bcrypt.hashSync(value, this.#SALT)
  }

  compare(value, encryptedValue) {
    return bcrypt.compareSync(value, encryptedValue)
  }
}

module.exports = Encryption
