"use strict";

// Role ids matter: 1 = Admin, 2 = Employee (see src/utils/roles.js).
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert("Roles", [
      { id: 1, name: "Admin", createdAt: now, updatedAt: now },
      { id: 2, name: "Employee", createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
