import { DataTypes, Model, Sequelize } from 'sequelize'

class User extends Model {}

export function init(sequelize: Sequelize) {
  User.init(
    {
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
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
