'use strict'

import { DataTypes, QueryInterface, Sequelize } from 'sequelize'

export async function up(queryInterface: QueryInterface, Sequelize: Sequelize) {
  await queryInterface.createTable('users', {
    userId: {
      type: DataTypes.STRING,
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW')
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW')
    }
  })
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('users')
}
