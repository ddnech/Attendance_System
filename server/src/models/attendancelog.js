"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AttendanceLog extends Model {
    static associate(models) {
      AttendanceLog.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  AttendanceLog.init(
    {
      user_id: DataTypes.INTEGER,
      date: DataTypes.DATEONLY, // the work day, "YYYY-MM-DD"
      clock_in: DataTypes.DATE,
      clock_out: DataTypes.DATE,
      status: DataTypes.ENUM("absent", "half-day", "full-day"),
    },
    { sequelize, modelName: "AttendanceLog" }
  );

  return AttendanceLog;
};
