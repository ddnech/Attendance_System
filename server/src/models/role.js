"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.User, { foreignKey: "role_id" });
    }
  }

  // The column is called "name" in the migration (it was "roleName" here before, which never matched).
  Role.init({ name: DataTypes.STRING }, { sequelize, modelName: "Role" });

  return Role;
};
