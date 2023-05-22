const factory = require('../models/factories/index.js');
const { faker } = require('@faker-js/faker/locale/en_US');
const { User, Like, Message } = require('../models/index.js');

const seedUsers = {
  up: async () => {
    // delete all old users
    await Like.destroy({ where: {} });
    await Message.destroy({ where: {} });
    await User.destroy({ where: {} });

    const users = [factory.create('User', {
      id: 1,
      email: 'test@mail.com',
      password: 'password',
      img_urls: [faker.image.avatar, faker.image.avatar, faker.image.avatar, faker.image.avatar],
    })];

    for (let i = 1; i < 40; i += 1) {
      users.push(factory.create('User', { id: i + 1, img_urls: [faker.image.avatar, faker.image.avatar, faker.image.avatar, faker.image.avatar] }));
    }

    await Promise.all(users);

    const likes = [];
    for (let i = 2; i < 20; i += 1) {
      likes.push(factory.create('Like', {
        userId: i,
        likedUserId: 1,
      }));
    }

    await Promise.all(likes);

    console.log('Users seeded successfully');
  },

  down: async () => {
    // Agrega código para revertir la semilla aquí
  },
};

module.exports = seedUsers;
