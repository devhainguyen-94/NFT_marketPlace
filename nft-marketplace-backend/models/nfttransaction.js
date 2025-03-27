'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NFTTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NFTTransaction.init({
    tokenId: DataTypes.INTEGER,
    buyer: DataTypes.STRING,
    seller: DataTypes.STRING,
    price: DataTypes.STRING,
    timestamp: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'NFTTransaction',
  });
  return NFTTransaction;
};