const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const db = require("../models");
const HttpError = require("../utils/httpError");
const { jwtSecret, jwtExpiresIn } = require("../config/env");
const { roleName } = require("../utils/roles");

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  full_name: user.full_name,
  role_id: user.role_id,
  role: roleName(user.role_id),
});

/** Finds the user behind an invite link, if the link is still valid. */
async function findInvite(token) {
  if (!token) return null;
  return db.User.findOne({
    where: {
      set_token: token,
      [Op.or]: [{ set_token_expires_at: null }, { set_token_expires_at: { [Op.gt]: new Date() } }],
    },
  });
}

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email } });

    if (user && !user.password) {
      throw new HttpError(401, "This account isn't set up yet. Use the link in your invite email to choose a password.");
    }
    // Same message for a wrong email or a wrong password.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpError(401, "Wrong email or password.");
    }

    const token = jwt.sign({ id: user.id, role_id: user.role_id }, jwtSecret, { expiresIn: jwtExpiresIn });
    res.json({ message: "Login successful", token, user: publicUser(user) });
  },

  async me(req, res) {
    const user = await db.User.findByPk(req.user.id, {
      include: [{ model: db.Salary, attributes: ["basic_salary"] }],
    });
    if (!user) throw new HttpError(404, "User not found.");
    res.json({ message: "Successfully retrieved user profile", data: { ...user.toJSON(), role: roleName(user.role_id) } });
  },

  // Kept for older clients.
  async roleId(req, res) {
    res.json({ role_id: req.user.role_id });
  },

  // GET /api/auth/invite/:token  (or the old /api/auth/profile?token=...)
  async inviteInfo(req, res) {
    const user = await findInvite(req.params.token || req.query.token);
    if (!user) throw new HttpError(404, "This link is invalid or has expired. Ask your admin for a new one.");
    res.json({
      message: "Successfully retrieved user profile",
      data: { email: user.email, full_name: user.full_name, birth_date: user.birth_date },
    });
  },

  // POST /api/auth/set-pass  with the token in the body or in ?token=
  async setPassword(req, res) {
    const user = await findInvite(req.body.token || req.query.token);
    if (!user) throw new HttpError(404, "This link is invalid or has expired. Ask your admin for a new one.");

    const { password, full_name, birth_date } = req.body;
    if (full_name) user.full_name = full_name;
    if (birth_date) user.birth_date = birth_date;
    user.password = await bcrypt.hash(password, 10);
    user.set_token = null;
    user.set_token_expires_at = null;
    await user.save();

    res.json({ message: "Your password is set. You can log in now." });
  },
};
