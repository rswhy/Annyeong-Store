'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, {foreignKey : 'CategoryId'})
      Product.hasMany(models.User, {foreignKey : 'ProductId'})
    }

    formatPrice () {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(this.price)
    }

  }
  Product.init({
    productName: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING,
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};