'use strict'

import { name, datatype, internet } from '@faker-js/faker'
import { QueryInterface, Sequelize } from 'sequelize'

import EncryptionService from '../../encryption'

export async function up(queryInterface: QueryInterface, Sequelize: Sequelize) {
  const users = []
  for (let i = 0; i < 10; i++) {
    const firstname = name.firstName()
    const lastname = name.lastName()
    users.push({
      userId: datatype.uuid(),
      firstname,
      lastname,
      email: internet.email(firstname, lastname),
      password: new EncryptionService().encrypt(`${firstname}123`)
    })
  }
  await queryInterface.bulkInsert('users', users, {})
}
export async function down(
  queryInterface: QueryInterface,
  Sequelize: Sequelize
) {
  await queryInterface.bulkDelete('users', {}, {})
}
