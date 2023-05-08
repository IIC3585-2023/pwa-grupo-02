const { factory, SequelizeAdapter } = require('factory-girl');
const { faker } = require('@faker-js/faker/locale/en_US');
const { User } = require('../index');

factory.setAdapter(new SequelizeAdapter());

factory.define('User', User, {
  email: faker.internet.email,
  password: faker.internet.password,
  firstName: faker.name.firstName,
  lastName: faker.name.lastName,
  gender: faker.datatype.boolean,
  img_urls: [faker.image.people, faker.image.people, faker.image.people, faker.image.people],
});
