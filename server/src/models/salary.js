"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Salary extends Model {
    static associate(models) {
      Salary.hasOne(models.User, { foreignKey: "salary_id" });
    }
  }

  Salary.init({ basic_salary: DataTypes.INTEGER }, { sequelize, modelName: "Salary" });

  return Salary;
};
