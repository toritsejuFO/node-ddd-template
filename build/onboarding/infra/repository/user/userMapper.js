"use strict";
const User = require('../../../domain/user/User');
class UserMapper {
    static toEntity(dbEntity) {
        const dataValues = dbEntity && dbEntity.dataValues;
        return dataValues ? new User(dataValues) : null;
    }
}
module.exports = UserMapper;
