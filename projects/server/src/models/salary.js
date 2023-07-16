'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Salary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Salary.hasOne(models.User, { foreignKey: "salary_id" });
      
    }
  }
  Salary.init({
    basic_salary: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Salary',
  });
  return Salary;
};