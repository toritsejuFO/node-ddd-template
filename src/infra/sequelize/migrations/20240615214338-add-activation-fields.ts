'use strict'

import { DataTypes, QueryInterface, Sequelize } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn('users', 'userId', {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    })
    await queryInterface.addColumn('users', 'isEmailVerified', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
    await queryInterface.addColumn('users', 'isActive', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('users', 'isEmailVerified')
    await queryInterface.removeColumn('users', 'isActive')
  }
}
