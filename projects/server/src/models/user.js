'use strict';
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
    }
  }
  User.init({
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    full_name: DataTypes.STRING,
    password: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    join_date: DataTypes.DATE,
    role_id: DataTypes.INTEGER,
    salary_id: DataTypes.INTEGER,
    isVerify: DataTypes.INTEGER,
    verificationToken: DataTypes.STRING,
    verificationTokenExpires: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};