'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payroll extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Payroll.init({
    basicSalary: DataTypes.INTEGER,
    deduction: DataTypes.INTEGER,
    netSalary: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Payroll',
  });
  return Payroll;
};