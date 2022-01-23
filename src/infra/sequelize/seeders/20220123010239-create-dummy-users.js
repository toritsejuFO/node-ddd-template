'use strict'
const faker = require('@faker-js/faker')
const Encryption = require('../../encryption')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = []
    for (let i = 0; i < 10; i++) {
      const firstName = faker.name.firstName()
      const lastName = faker.name.lastName()
      users.push({
        userId: faker.datatype.uuid(),
        firstName,
        lastName,
        email: faker.internet.email(firstName, lastName),
        password: new Encryption().encrypt(`${firstName}123`)
      })
    }
    await queryInterface.bulkInsert('users', users, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {})
  }
}
