import User from '../../../domain/entities/user/User'

export default class UserMapper {
  static toEntity(dbEntity: any) {
    const dataValues = dbEntity && dbEntity.dataValues
    return dataValues ? new User(dataValues) : null
  }
}

module.exports = UserMapper
