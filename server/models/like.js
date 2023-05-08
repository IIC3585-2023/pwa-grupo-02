const {
  Model,
} = require('sequelize');

module.exports = (sequelize) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
        },
      });
      this.belongsTo(models.User, {
        foreignKey: {
          name: 'likedUserId',
        },
      });
    }
  }
  Like.init({
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};
