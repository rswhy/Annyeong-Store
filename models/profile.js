'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {foreignKey : 'UserId'})
    }
  }
  Profile.init({
    fullName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg : 'Full Name is required'}
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Choose your gender wisely'}
      }
    },
    email: {
      type:  DataTypes.STRING,
      validate: {
        isEmail: {msg: 'Email is required'}
      }
    },
    phone: {
      type:  DataTypes.STRING,
      validate: {
        notEmpty: {msg : 'Phone Number is required'}
      }
    },
    address: {
      type:  DataTypes.STRING,
      validate: {
        notEmpty: {msg : 'Address is required'}
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};