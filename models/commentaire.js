'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Commentaire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Commentaire.belongsTo(models.User,{
        as: 'user', foreignkey: 'userId'
      })
      models.Commentaire.belongsTo(models.Publication,{
        as: 'publication', foreignkey: 'publicationId'
      })
    }
  }
  Commentaire.init({
    idCommentaire: DataTypes.INTEGER,
    texte: DataTypes.STRING,
    User_idUser: DataTypes.INTEGER,
    Publication_idPublication: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Commentaire',
  });
  return Commentaire;
};