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
    clock_in: DataTypes.DATE,
    clock_out: DataTypes.DATE,
    user_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM('absent', 'half-day', 'full-day'),
    },
  }, {
    sequelize,
    modelName: 'AttendanceLog',
  });
  return AttendanceLog;
};