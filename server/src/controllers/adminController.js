const dayjs = require("dayjs");
const db = require("../models");
const HttpError = require("../utils/httpError");
const { ROLE } = require("../utils/roles");
const { dayKey, isWorkday } = require("../utils/workdays");
const { sendInvite } = require("../services/invites");
const { monthHistory } = require("../services/attendance");

const staffAttributes = ["id", "email", "full_name", "birth_date", "join_date", "createdAt"];

module.exports = {
  // POST /api/admin/register  -> creates a staff member and emails them a set-password link
  async registerStaff(req, res) {
    const { email, full_name, birth_date, join_date, salary } = req.body;

    const user = await db.sequelize.transaction(async (transaction) => {
      const pay = await db.Salary.create({ basic_salary: salary }, { transaction });
      return db.User.create(
        { email, full_name, birth_date, join_date, role_id: ROLE.STAFF, salary_id: pay.id },
        { transaction }
      );
    });

    const invite = await sendInvite(user);

    res.status(201).json({
      message: invite.emailSent
        ? `${user.full_name} was added. We emailed them a link to set their password.`
        : `${user.full_name} was added, but the email couldn't be sent. Copy the setup link and send it to them.`,
      data: user,
      setupLink: invite.link,
      emailSent: invite.emailSent,
    });
  },

  // GET /api/admin/users?date=2026-10-22  -> every staff member and their attendance that day
  async staffList(req, res) {
    const date = dayjs(req.query.date).isValid() && req.query.date ? dayKey(req.query.date) : dayKey();

    const staff = await db.User.findAll({
      where: { role_id: ROLE.STAFF },
      attributes: [...staffAttributes, "password", "set_token_expires_at"],
      include: [
        { model: db.Salary, attributes: ["basic_salary"] },
        { model: db.AttendanceLog, required: false, where: { date } },
      ],
      order: [["full_name", "ASC"]],
    });

    const data = staff.map((user) => {
      const log = user.AttendanceLogs?.[0] || null;
      return {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        birth_date: user.birth_date,
        join_date: user.join_date,
        basic_salary: user.Salary?.basic_salary ?? null,
        invitePending: !user.password,
        inviteExpiresAt: user.password ? null : user.set_token_expires_at,
        attendance: log && { clock_in: log.clock_in, clock_out: log.clock_out, status: log.status },
      };
    });

    const active = data.filter((u) => !u.invitePending);
    const summary = {
      date,
      workday: isWorkday(date),
      total: active.length,
      clockedIn: active.filter((u) => u.attendance?.clock_in && !u.attendance?.clock_out).length,
      done: active.filter((u) => u.attendance?.clock_out).length,
      absent: active.filter((u) => u.attendance?.status === "absent").length,
      notYet: active.filter((u) => !u.attendance).length,
      pendingInvites: data.length - active.length,
    };

    res.json({ summary, data });
  },

  // POST /api/admin/users/:id/invite  -> new set-password link (the old one stops working)
  async resendInvite(req, res) {
    const user = await db.User.findOne({ where: { id: req.params.id, role_id: ROLE.STAFF } });
    if (!user) throw new HttpError(404, "Staff member not found.");
    if (user.password) throw new HttpError(400, `${user.full_name} has already set up their account.`);

    const invite = await sendInvite(user);
    res.json({
      message: invite.emailSent ? `New link sent to ${user.email}.` : "New link created, but the email couldn't be sent. Copy it instead.",
      setupLink: invite.link,
      emailSent: invite.emailSent,
    });
  },

  // GET /api/admin/users/:id/attendance?year=2026&month=10
  async staffAttendance(req, res) {
    const user = await db.User.findOne({
      where: { id: req.params.id, role_id: ROLE.STAFF },
      attributes: staffAttributes,
    });
    if (!user) throw new HttpError(404, "Staff member not found.");

    const result = await monthHistory(user.id, req.query);
    res.json({ user, ...result });
  },
};
