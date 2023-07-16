'use strict';
const dayjs = require('dayjs');
const Chance = require('chance');
const chance = new Chance();

module.exports = {
  async up(queryInterface, Sequelize) {
    let dummyPayrolls = [];
    let currentDate = dayjs();
    let monthsToExclude = 1; // Exclude the current month
  
    for (let i = 0; i < 18 - monthsToExclude; i++) {
      let payrollMonth = currentDate.subtract(i, 'month');
  
      [2, 3].forEach(userId => {
        dummyPayrolls.push({
          user_id: userId,
          date: payrollMonth.toDate(),
          amount: chance.integer({ min: 2000, max: 3000 }),
          deductions: chance.integer({ min: 0, max: 500 }),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
    }
  
    return queryInterface.bulkInsert('Payrolls', dummyPayrolls, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Payrolls', null, {});
  }
};