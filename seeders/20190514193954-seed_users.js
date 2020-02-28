'use strict';

var faker = require('faker');
var argon2 = require('argon2');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    faker.seed(0xDEADBEEF);

    var users = [];
    for (var i = 0; i < 50; i++) {
      let token = faker.random.number({ min: 0, max: 99999 });

      let password = faker.internet.password();
      let hash = await argon2.hash(password);
        var user = {
          username: faker.internet.userName(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          password: hash.toString(),
          resetToken: token.toString().padStart(5, '0')
        };

        users.push(user);
        console.log(user);
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
