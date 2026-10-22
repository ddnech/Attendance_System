"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payroll extends Model {
    static associate(models) {
      Payroll.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  Payroll.init(
    {
      user_id: DataTypes.INTEGER,
      date: DataTypes.DATE, // when the payroll was calculated (last day of the month)
      amount: DataTypes.INTEGER,
      deductions: DataTypes.INTEGER,
    },
    { sequelize, modelName: "Payroll" }
  );

  return Payroll;
};
