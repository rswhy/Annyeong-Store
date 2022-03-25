'use strict';
const bcrypt = require('bcryptjs') 
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, {foreignKey : 'UserId'})
      User.belongsTo(models.Product, {foreignKey : 'ProductId'})
    }
  }
  User.init({
    userName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Username is required'}
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Password is required'}
      }
    },
    membership: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Choose your membership'}
      }
    },
    ProductId: DataTypes.INTEGER
  }, {
    sequelize,
    hooks: {
      beforeCreate(instance, options) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(instance.password, salt)

        instance.password = hash
      }
    },
    modelName: 'User',
  });
  return User;
};