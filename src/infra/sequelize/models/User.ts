import { DataTypes, Model, Sequelize } from 'sequelize'

class User extends Model {}

export function init(sequelize: Sequelize) {
  User.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    { sequelize, tableName: 'users', modelName: 'User' }
  )
}
