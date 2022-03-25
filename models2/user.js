'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require("bcryptjs")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile)
    }
  }
  User.init({
    userName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'User Name is required'}
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
    hooks: {
      beforeCreate(instance, options) {
  
        // instance.ProductId = 0

        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(instance.password, salt)

        instance.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};

