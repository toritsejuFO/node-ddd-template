'use strict'

import faker from '@faker-js/faker'
import { QueryInterface } from 'sequelize'

import HashService from '@/infra/hashing'

export async function up(queryInterface: QueryInterface) {
  const users = []
  const hashService = new HashService()

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
      password: hashService.hash(`${firstname}123`)
    })
  }
  await queryInterface.bulkInsert('users', users, {})
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete('users', {}, {})
}
