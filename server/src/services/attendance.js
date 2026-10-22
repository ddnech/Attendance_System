const { Op } = require("sequelize");
const dayjs = require("dayjs");
const db = require("../models");
const { monthInfo } = require("../utils/workdays");

const STATUSES = ["absent", "half-day", "full-day"];

/**
 * One person's attendance for a month, plus counts per status.
 * Used by the staff "My attendance" page and by admins looking at a staff member.
 */
async function monthHistory(userId, query = {}) {
  const now = dayjs();
  const year = Number(query.year) || now.year();
  const month = Math.min(12, Math.max(1, Number(query.month) || now.month() + 1));
  const statuses = query.status
    ? String(query.status).split(",").filter((s) => STATUSES.includes(s))
    : STATUSES;
  const sort = String(query.sort).toUpperCase() === "ASC" ? "ASC" : "DESC";

  const { from, to, workdays } = monthInfo(year, month);

  const logs = await db.AttendanceLog.findAll({
    where: { user_id: userId, date: { [Op.between]: [from, to] } },
    order: [["date", sort]],
  });

  const statistics = { absent: 0, "half-day": 0, "full-day": 0, businessDays: workdays };
  for (const log of logs) statistics[log.status]++;

  return {
    filters: { year, month, status: statuses, sort },
    statistics,
    data: logs
      .filter((log) => statuses.includes(log.status))
      .map((log) => ({ date: log.date, clockIn: log.clock_in, clockOut: log.clock_out, status: log.status })),
  };
}

module.exports = { monthHistory, STATUSES };
