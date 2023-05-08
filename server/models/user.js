const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Like, {
        as: 'likes',
        foreignKey: {
          name: 'userId',
        },
      });
      this.hasMany(models.Like, {
        as: 'liked',
        foreignKey: {
          name: 'likedUserId',
        },
      });
      this.hasMany(models.Message, {
        as: 'messagesSent',
        foreignKey: {
          name: 'userId',
        },
      });
      this.hasMany(models.Message, {
        as: 'MessagesReceived',
        foreignKey: {
          name: 'receiverUserId',
        },
      });
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    img_urls: DataTypes.ARRAY(DataTypes.STRING),
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
