const User = require('../../../domain/user/User')

class UserMapper {
  static toEntity(dbEntity) {
    return new User(dbEntity && dbEntity.dataValues)
  }
}

module.exports = UserMapper
