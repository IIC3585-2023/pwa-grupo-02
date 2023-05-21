const { factory, SequelizeAdapter } = require('factory-girl');
const { Like } = require('../index');

factory.setAdapter(new SequelizeAdapter());

factory.define('Like', Like, {
  userId: factory.assoc('User', 'id'),
  likedUserId: factory.assoc('User', 'id'),
  isRejection: false,
});
