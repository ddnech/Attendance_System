"use strict";
const dayjs = require("dayjs");
const { isWorkday } = require("../utils/workdays");

// About three months of attendance for the demo staff, up to yesterday.
// Today: a few people have already clocked in (if it's a workday), so the admin's
// "Today" page has something on it. Nadia is left alone so you can clock in as her.

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

// id, how often they're absent, how often they forget to clock out,
// and whether they've already clocked in today.
const STAFF = [
  { id: 2, seed: 7, absentRate: 0.03, halfRate: 0.06, inToday: false }, // Nadia: reliable, keep today free
  { id: 3, seed: 21, absentRate: 0.1, halfRate: 0.14, inToday: true }, // Kevin: a few absences
  { id: 4, seed: 33, absentRate: 0.02, halfRate: 0.03, inToday: true }, // Citra: almost perfect
  { id: 5, seed: 48, absentRate: 0.12, halfRate: 0.1, inToday: false }, // Rizky: absent more often
  { id: 6, seed: 51, absentRate: 0.04, halfRate: 0.05, inToday: true }, // Melati
  { id: 7, seed: 64, absentRate: 0.05, halfRate: 0.25, inToday: true }, // Bayu: forgets to clock out
  { id: 8, seed: 77, absentRate: 0.05, halfRate: 0.08, inToday: false }, // Intan: joined 1 Sep 2026
];
const JOINED = { 8: "2026-09-01" };

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    if (process.env.SEED_DEMO_DATA === "false") return;

    const rows = [];
    const now = dayjs();
    const yesterday = now.subtract(1, "day").startOf("day");

    for (const person of STAFF) {
      const rand = random(person.seed);
      const earliest = now.subtract(3, "month").startOf("month");
      const joined = JOINED[person.id] ? dayjs(JOINED[person.id]) : earliest;
      const first = joined.isAfter(earliest) ? joined : earliest;

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

      // Today: clocked in earlier this morning, still working.
      const clockInToday = now.startOf("day").hour(7).minute(45).add(Math.floor(rand() * 105), "minute");
      if (person.inToday && isWorkday(now) && clockInToday.isBefore(now)) {
        rows.push({
          user_id: person.id,
          date: now.format("YYYY-MM-DD"),
          clock_in: clockInToday.toDate(),
          clock_out: null,
          status: "half-day",
          createdAt: clockInToday.toDate(),
          updatedAt: clockInToday.toDate(),
        });
      }
    }

    if (rows.length) await queryInterface.bulkInsert("AttendanceLogs", rows);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("AttendanceLogs", null, {});
  },
};