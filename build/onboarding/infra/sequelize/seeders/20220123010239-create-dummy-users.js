'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const faker = require('@faker-js/faker');
const Encryption = require('../../encryption');
module.exports = {
    up: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        const users = [];
        for (let i = 0; i < 10; i++) {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();
            users.push({
                userId: faker.datatype.uuid(),
                firstName,
                lastName,
                email: faker.internet.email(firstName, lastName),
                password: new Encryption().encrypt(`${firstName}123`)
            });
        }
        yield queryInterface.bulkInsert('users', users, {});
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.bulkDelete('users', null, {});
    })
};
