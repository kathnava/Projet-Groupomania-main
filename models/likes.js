'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Likes.belongsTo(models.User,{
        as: 'user', foreignkey: 'userId'
      })
      models.Likes.belongsTo(models.Publication,{
        as: 'publication', foreignkey: 'publicationId'
      })
    }
  }
  Likes.init({
    idLikes: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    publicationId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Likes',
  });
  return Likes;
};