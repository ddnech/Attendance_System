'use strict';
const Chance = require('chance');
const chance = new Chance();
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

function isBusinessDay(date) {
  const day = date.utc().day();
  return day !== 0 && day !== 6;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const statusOptions = ['absent', 'half-day', 'full-day'];
    const attendanceLogs = [];

    const userIds = [2, 3];

    for (const userId of userIds) {
      let day = dayjs().startOf('day').subtract(3, 'month');
      const endDay = dayjs().startOf('day');

      while (!day.isAfter(endDay)) {
        if (isBusinessDay(day)) {
          let clockIn, clockOut;
          const status = chance.pickone(statusOptions);

          let clockInHour, clockOutHour;
          switch (status) {
            case 'half-day':
              clockInHour = chance.hour({ min: 8, max: 11, twentyfour: true });
              clockIn = dayjs.utc(day).hour(clockInHour).toDate();
              break;
            case 'full-day':
              clockInHour = chance.hour({ min: 8, max: 11, twentyfour: true });
              clockOutHour = chance.hour({ min: clockInHour + 1, max: 18, twentyfour: true });
              clockIn = dayjs.utc(day).hour(clockInHour).toDate();
              clockOut = dayjs.utc(day).hour(clockOutHour).toDate();
              break;
          }

          attendanceLogs.push({
            clock_in: clockIn,
            clock_out: clockOut,
            user_id: userId,
            date: dayjs.utc(day).toDate(),
            status: status,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }

        day = day.add(1, 'day');
      }
    }

    return queryInterface.bulkInsert('AttendanceLogs', attendanceLogs, {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('AttendanceLogs', null, {});
  }
};
