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
      User.belongsTo(models.Salary, { foreignKey: "salary_id" });
    }
  }
  User.init({
    email: DataTypes.STRING,
    full_name: DataTypes.STRING,
    password: DataTypes.STRING,
    birth_date: DataTypes.DATE,
    join_date: DataTypes.DATE,
    role_id: DataTypes.INTEGER,
    salary_id: DataTypes.INTEGER,
    set_token: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};