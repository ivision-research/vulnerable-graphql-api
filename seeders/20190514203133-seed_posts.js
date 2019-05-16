'use strict';

var faker = require('faker');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   faker.seed(0xC0FFEE)

   var posts = [
     {
       UserId: 1,
       title: "Secret private post",
       content: "This is a private post. Go away.",
       public: false
     }
   ];
   for (var i = 0; i < 250; i++) {
     var user_id = getRandomInt(1, 51);
     var post = {
       UserId: user_id,
       title: faker.lorem.sentence(),
       content: faker.lorem.paragraphs(),
       public: getRandomInt(0, 5) != 0,
     }
     posts.push(post)
   }

   return queryInterface.bulkInsert('Posts', posts, {})
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
