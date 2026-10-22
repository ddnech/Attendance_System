"use strict";

// Monthly basic salaries in rupiah, one per demo user (ids match the users seeder).
const SALARIES = [15_000_000, 7_500_000, 6_000_000, 8_250_000, 5_800_000, 9_000_000, 6_500_000, 7_000_000, 5_500_000];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "Salaries",
      SALARIES.map((basic_salary, i) => ({ id: i + 1, basic_salary, createdAt: now, updatedAt: now }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Salaries", { id: { [Sequelize.Op.in]: SALARIES.map((_, i) => i + 1) } });
  },
};