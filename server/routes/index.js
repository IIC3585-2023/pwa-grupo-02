const { Router } = require('express');

const { faker } = require('@faker-js/faker/locale/en_US');
const factory = require('../models/factories/index.js');
const { User, Like, Message } = require('../models/index.js');

const usersRoutes = require('./user');

const router = Router();

router.use('/users', usersRoutes);

router.get('/seeds', async (req, res) => {
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

  res.json({ message: 'Users seeded successfully' });
});

module.exports = router;
