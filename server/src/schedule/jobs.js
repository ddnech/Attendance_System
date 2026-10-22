const schedule = require("node-schedule");
const { Op } = require("sequelize");
const dayjs = require("dayjs");
const db = require("../models");
const { ROLE } = require("../utils/roles");
const { isWorkday, dayKey, monthInfo } = require("../utils/workdays");
const { computePayroll } = require("../utils/payroll");

/** Staff who have finished setting up their account and had already joined on `day`. */
const activeStaff = (day) =>
  db.User.findAll({
    where: { role_id: ROLE.STAFF, password: { [Op.ne]: null }, join_date: { [Op.lte]: day } },
    include: [{ model: db.Salary, attributes: ["basic_salary"] }],
  });

/** Marks everyone who never clocked in on `date` as absent. Safe to run twice. */
async function markAbsent(date = new Date()) {
  if (!isWorkday(date)) return;
  const day = dayKey(date);
  try {
    const staff = await activeStaff(day);
    let count = 0;
    for (const user of staff) {
      const [, created] = await db.AttendanceLog.findOrCreate({
        where: { user_id: user.id, date: day },
        defaults: { status: "absent" },
      });
      if (created) count++;
    }
    if (count) console.log(`[absent] Marked ${count} people absent on ${day}.`);
  } catch (error) {
    console.error("[absent] Failed:", error.message);
  }
}

/** Creates this month's payroll for every active staff member. Skips anyone who already has one. */
async function runPayroll(date = new Date()) {
  const now = dayjs(date);
  const { from, to, workdays, start, end } = monthInfo(now.year(), now.month() + 1);
  try {
    const staff = await activeStaff(to);
    for (const user of staff) {
      if (!user.Salary) continue;

      const exists = await db.Payroll.findOne({
        where: { user_id: user.id, date: { [Op.between]: [start.toDate(), end.toDate()] } },
      });
      if (exists) continue;

      const logs = await db.AttendanceLog.findAll({
        where: { user_id: user.id, date: { [Op.between]: [from, to] } },
        attributes: ["status"],
      });
      const pay = computePayroll({
        basicSalary: user.Salary.basic_salary,
        workdays,
        statuses: logs.map((l) => l.status),
      });
      await db.Payroll.create({ user_id: user.id, date: now.toDate(), ...pay });
    }
    console.log(`[payroll] Done for ${now.format("MMMM YYYY")}.`);
  } catch (error) {
    console.error("[payroll] Failed:", error.message);
  }
}

function startJobs() {
  // Catch up on yesterday in case the server was off last night.
  markAbsent(dayjs().subtract(1, "day").toDate());

  // 22:00 every day: anyone who didn't clock in today is absent.
  schedule.scheduleJob("0 22 * * *", () => markAbsent());
  // 23:00 on the last day of the month: payroll (after the absent check has run).
  schedule.scheduleJob("0 23 L * *", () => runPayroll());
}

module.exports = { startJobs, markAbsent, runPayroll };
