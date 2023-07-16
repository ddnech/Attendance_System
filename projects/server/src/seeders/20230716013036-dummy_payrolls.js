'use strict';
const dayjs = require('dayjs');
const Chance = require('chance');
const chance = new Chance();

module.exports = {
  async up(queryInterface, Sequelize) {
    let dummyPayrolls = [];
    let currentDate = dayjs();

    // Creating dummy data for 18 months
    for (let i = 0; i < 18; i++) {
      let payrollMonth = currentDate.subtract(i, 'month');

      // Create payroll for user id 2 and 4
      [2, 4].forEach(userId => {
        dummyPayrolls.push({
          user_id: userId,
          date: payrollMonth.toDate(), // Use date field to store payroll date
          amount: chance.integer({min: 2000, max: 3000}), // random amount between 2000 and 3000
          deductions: chance.integer({min: 0, max: 500}), // random deduction up to 500
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
    }

    // Insert the dummyPayrolls array into the Payrolls table
    return queryInterface.bulkInsert('Payrolls', dummyPayrolls, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Payrolls', null, {});
  }
};