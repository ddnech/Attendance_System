"use strict";
const dayjs = require("dayjs");
const { QueryTypes } = require("sequelize");
const { monthInfo } = require("../utils/workdays");
const { computePayroll } = require("../utils/payroll");

// Payslips for the last three full months, worked out from the seeded attendance
// with the same formula the real monthly job uses.
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const select = (sql, replacements) =>
      queryInterface.sequelize.query(sql, { type: QueryTypes.SELECT, replacements });

    const staff = await select(
      "SELECT u.id, s.basic_salary FROM Users u JOIN Salaries s ON s.id = u.salary_id WHERE u.role_id = 2 AND u.password IS NOT NULL"
    );

    const rows = [];
    for (let back = 3; back >= 1; back--) {
      const month = dayjs().subtract(back, "month");
      const { from, to, workdays, end } = monthInfo(month.year(), month.month() + 1);

      for (const person of staff) {
        const logs = await select(
          "SELECT status FROM AttendanceLogs WHERE user_id = :id AND date BETWEEN :from AND :to",
          { id: person.id, from, to }
        );
        if (!logs.length) continue;

        const pay = computePayroll({ basicSalary: person.basic_salary, workdays, statuses: logs.map((l) => l.status) });
        const paidOn = end.hour(23).minute(0).second(0).toDate();
        rows.push({ user_id: person.id, date: paidOn, ...pay, createdAt: paidOn, updatedAt: paidOn });
      }
    }

    if (rows.length) await queryInterface.bulkInsert("Payrolls", rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Payrolls", null, {});
  },
};
