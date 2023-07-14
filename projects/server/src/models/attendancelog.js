'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AttendanceLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AttendanceLog.init({
    clockIn: DataTypes.DATE,
    clockOut: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('absent', 'half-day', 'full-day'),
    },
  }, {
    sequelize,
    modelName: 'AttendanceLog',
  });
  return AttendanceLog;
};