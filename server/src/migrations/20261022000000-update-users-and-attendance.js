"use strict";

/**
 * 2026 update:
 *  - invite links expire, so store when
 *  - dates without a time (birthday, join date, work day) become DATE columns
 *  - one attendance row per person per day, enforced by the database
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "set_token_expires_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.changeColumn("Users", "birth_date", { type: Sequelize.DATEONLY, allowNull: false });
    await queryInterface.changeColumn("Users", "join_date", { type: Sequelize.DATEONLY, allowNull: false });
    await queryInterface.changeColumn("AttendanceLogs", "date", { type: Sequelize.DATEONLY, allowNull: false });

    await queryInterface.addIndex("AttendanceLogs", ["user_id", "date"], {
      unique: true,
      name: "attendance_user_day",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("AttendanceLogs", "attendance_user_day");
    await queryInterface.changeColumn("AttendanceLogs", "date", { type: Sequelize.DATE, allowNull: false });
    await queryInterface.changeColumn("Users", "join_date", { type: Sequelize.DATE, allowNull: false });
    await queryInterface.changeColumn("Users", "birth_date", { type: Sequelize.DATE, allowNull: false });
    await queryInterface.removeColumn("Users", "set_token_expires_at");
  },
};
