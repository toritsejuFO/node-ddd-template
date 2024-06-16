'use strict'

import { DataTypes, QueryInterface, Sequelize } from 'sequelize'

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('users', 'password', {
      type: DataTypes.STRING,
      allowNull: false
    })
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('users', 'password')
  }
}
