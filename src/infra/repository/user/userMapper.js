const User = require('../../../domain/user/User')

class UserMapper {
  static toEntity(dbEntity) {
    const dataValues = dbEntity && dbEntity.dataValues
    if (dataValues && dataValues.password) {
      delete dataValues.password
    }
    return new User(dataValues)
  }
}

module.exports = UserMapper
