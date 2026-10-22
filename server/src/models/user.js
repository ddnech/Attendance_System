"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: "role_id" });
      User.belongsTo(models.Salary, { foreignKey: "salary_id" });
      User.hasMany(models.AttendanceLog, { foreignKey: "user_id" });
      User.hasMany(models.Payroll, { foreignKey: "user_id" });
    }

    // Never send the password hash or the invite token back to the client.
    toJSON() {
      const values = { ...this.get() };
      delete values.password;
      delete values.set_token;
      return values;
    }
  }

  User.init(
    {
      email: DataTypes.STRING,
      full_name: DataTypes.STRING,
      password: DataTypes.STRING,
      birth_date: DataTypes.DATEONLY,
      join_date: DataTypes.DATEONLY,
      role_id: DataTypes.INTEGER,
      salary_id: DataTypes.INTEGER,
      set_token: DataTypes.STRING,
      set_token_expires_at: DataTypes.DATE,
    },
    { sequelize, modelName: "User" }
  );

  return User;
};
