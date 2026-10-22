"use strict";
const dayjs = require("dayjs");
const { isWorkday } = require("../utils/workdays");

// About three months of attendance for the two demo staff, up to yesterday.
// Today is left empty so you can try clocking in yourself.

// Small seeded random generator, so the demo data is the same every time.
function random(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STAFF = [
  { id: 2, seed: 7, absentRate: 0.04, halfRate: 0.08 },
  { id: 3, seed: 21, absentRate: 0.1, halfRate: 0.15 },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    if (process.env.SEED_DEMO_DATA === "false") return;

    const rows = [];
    const first = dayjs().subtract(3, "month").startOf("month");
    const yesterday = dayjs().subtract(1, "day").startOf("day");

    for (const person of STAFF) {
      const rand = random(person.seed);
      for (let day = first; !day.isAfter(yesterday, "day"); day = day.add(1, "day")) {
        if (!isWorkday(day)) continue;

        const roll = rand();
        const status = roll < person.absentRate ? "absent" : roll < person.absentRate + person.halfRate ? "half-day" : "full-day";

        // Clock in between 07:45 and 09:30, clock out between 16:30 and 18:30.
        const clockIn = status === "absent" ? null : day.hour(7).minute(45).add(Math.floor(rand() * 105), "minute");
        const clockOut = status === "full-day" ? day.hour(16).minute(30).add(Math.floor(rand() * 120), "minute") : null;

        rows.push({
          user_id: person.id,
          date: day.format("YYYY-MM-DD"),
          clock_in: clockIn ? clockIn.toDate() : null,
          clock_out: clockOut ? clockOut.toDate() : null,
          status,
          createdAt: day.toDate(),
          updatedAt: day.toDate(),
        });
      }
    }

    if (rows.length) await queryInterface.bulkInsert("AttendanceLogs", rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("AttendanceLogs", null, {});
  },
};
