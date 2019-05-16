'use strict';

var faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {

    faker.seed(0xDEADBEEF);

    var users = [];
    for (var i = 0; i < 50; i++) {
      var user = {
        username: faker.internet.userName(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: faker.internet.password()
      }

      users.push(user);

    }

   return queryInterface.bulkInsert('Users', users, {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
