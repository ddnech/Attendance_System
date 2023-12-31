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
    user_id: DataTypes.INTEGER,
    date:DataTypes.DATE,
    amount: DataTypes.INTEGER,
    deductions: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Payroll',
  });
  return Payroll;
};