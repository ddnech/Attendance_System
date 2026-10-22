const { Op } = require("sequelize");
const dayjs = require("dayjs");
const db = require("../models");
const HttpError = require("../utils/httpError");
const { isWorkday, dayKey } = require("../utils/workdays");
const { monthHistory } = require("../services/attendance");

const todayLog = (userId) => db.AttendanceLog.findOne({ where: { user_id: userId, date: dayKey() } });

module.exports = {
  // GET /api/staff/check-attendance  -> today's record
  async today(req, res) {
    const log = await todayLog(req.user.id);
    res.json({
      date: dayKey(),
      workday: isWorkday(new Date()),
      data: log ? log.toJSON() : { clock_in: null, clock_out: null, status: null },
    });
  },

  async clockIn(req, res) {
    if (!isWorkday(new Date())) throw new HttpError(400, "It's the weekend. Clocking in is only open Monday to Friday.");

    const existing = await todayLog(req.user.id);
    if (existing?.status === "absent") throw new HttpError(400, "Today was already marked as absent.");
    if (existing) throw new HttpError(400, "You already clocked in today.");

    const log = await db.AttendanceLog.create({
      user_id: req.user.id,
      date: dayKey(),
      clock_in: new Date(),
      // Counts as a half day until you clock out.
      status: "half-day",
    });
    res.status(201).json({ message: `Clocked in at ${dayjs(log.clock_in).format("HH:mm")}.`, data: log });
  },

  async clockOut(req, res) {
    const log = await todayLog(req.user.id);
    if (!log || !log.clock_in) throw new HttpError(400, "You haven't clocked in today.");
    if (log.clock_out) throw new HttpError(400, "You already clocked out today.");

    await log.update({ clock_out: new Date(), status: "full-day" });
    res.json({ message: `Clocked out at ${dayjs(log.clock_out).format("HH:mm")}. See you tomorrow.`, data: log });
  },

  // GET /api/staff/attendance/history?year=2026&month=10&status=absent,half-day&sort=DESC
  async attendanceHistory(req, res) {
    const result = await monthHistory(req.user.id, req.query);
    res.json({ message: "Successfully retrieved attendance history", ...result });
  },

  // GET /api/staff/payroll/history?year=2026&month=&sort=date,DESC
  async payrollHistory(req, res) {
    const year = Number(req.query.year) || dayjs().year();
    const month = Number(req.query.month) || null;
    const direction = String(req.query.sort || "").toUpperCase().endsWith("ASC") ? "ASC" : "DESC";

    const start = month ? dayjs().year(year).month(month - 1).startOf("month") : dayjs().year(year).startOf("year");
    const end = month ? start.endOf("month") : start.endOf("year");

    const [records, user] = await Promise.all([
      db.Payroll.findAll({
        where: { user_id: req.user.id, date: { [Op.between]: [start.toDate(), end.toDate()] } },
        order: [["date", direction]],
      }),
      db.User.findByPk(req.user.id, { include: [{ model: db.Salary, attributes: ["basic_salary"] }] }),
    ]);

    res.json({ basicSalary: user?.Salary?.basic_salary ?? null, data: records });
  },
};
