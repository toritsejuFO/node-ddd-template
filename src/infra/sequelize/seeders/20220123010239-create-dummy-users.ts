'use strict'

import faker from '@faker-js/faker'
import { QueryInterface } from 'sequelize'

import EncryptionService from '@infra/encryption'

export async function up(queryInterface: QueryInterface) {
  const users = []
  for (let i = 0; i < 10; i++) {
    const firstname = faker.name.firstName()
    const lastname = faker.name.lastName()
    const activated = faker.datatype.boolean()

    users.push({
      userId: faker.datatype.uuid(),
      firstname,
      lastname,
      isEmailVerified: activated,
      isActive: activated,
      email: faker.internet.email(firstname, lastname),
      password: new EncryptionService().encrypt(`${firstname}123`)
    })
  }
  await queryInterface.bulkInsert('users', users, {})
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete('users', {}, {})
}
