"use strict";

// Monthly basic salaries in rupiah, one per demo user (ids match the users seeder).
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert("Salaries", [
      { id: 1, basic_salary: 15_000_000, createdAt: now, updatedAt: now },
      { id: 2, basic_salary: 7_500_000, createdAt: now, updatedAt: now },
      { id: 3, basic_salary: 6_000_000, createdAt: now, updatedAt: now },
      { id: 4, basic_salary: 5_500_000, createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Salaries", { id: { [Sequelize.Op.in]: [1, 2, 3, 4] } });
  },
};
