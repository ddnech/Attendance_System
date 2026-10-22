const { body, validationResult } = require("express-validator");
const dayjs = require("dayjs");
const db = require("../models");

/** Runs the checks and answers with the first error message if something is wrong. */
const validate = (checks) => async (req, res, next) => {
  for (const check of checks) {
    await check.run(req);
  }
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = result.array();
  return res.status(400).json({ message: errors[0].msg, errors });
};

const notInFuture = (label) => (value) => {
  if (dayjs(value).isAfter(dayjs(), "day")) throw new Error(`${label} can't be in the future.`);
  return true;
};

const emailIsFree = async (value) => {
  if (await db.User.findOne({ where: { email: value } })) {
    throw new Error("Someone is already registered with that email.");
  }
  return true;
};

const strongPassword = body("password")
  .isStrongPassword({ minLength: 8, minLowercase: 0, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
  .withMessage("Password needs at least 8 characters, with a capital letter, a number and a symbol.");

module.exports = {
  login: validate([
    body("email").trim().isEmail().withMessage("Enter a valid email address."),
    body("password").notEmpty().withMessage("Enter your password."),
  ]),

  registerStaff: validate([
    body("email").trim().isEmail().withMessage("Enter a valid email address.")
      .normalizeEmail({ gmail_remove_dots: false })
      .custom(emailIsFree),
    body("full_name").trim().notEmpty().withMessage("Full name is required.")
      .isLength({ max: 100 }).withMessage("Full name is too long."),
    body("birth_date").isDate({ format: "YYYY-MM-DD", strictMode: true }).withMessage("Enter a valid birth date.")
      .custom(notInFuture("Birth date")),
    body("join_date").isDate({ format: "YYYY-MM-DD", strictMode: true }).withMessage("Enter a valid join date.")
      .custom(notInFuture("Join date")),
    body("salary").isInt({ min: 1, max: 1_000_000_000 })
      .withMessage("Salary must be a whole number in rupiah, more than 0.").toInt(),
  ]),

  setPassword: validate([
    body("full_name").optional({ values: "falsy" }).trim().isLength({ max: 100 }).withMessage("Full name is too long."),
    body("birth_date").optional({ values: "falsy" })
      .isDate({ format: "YYYY-MM-DD", strictMode: true }).withMessage("Enter a valid birth date.")
      .custom(notInFuture("Birth date")),
    strongPassword,
    body("confirm_password").custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Passwords don't match.");
      return true;
    }),
  ]),
};
