'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Salaries",
      [
        {
          basic_salary: 15000000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          basic_salary: 150000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          basic_salary: 13000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
  
  }
};
