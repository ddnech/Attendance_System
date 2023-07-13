const { body, validationResult } = require("express-validator");
const db = require("../../models");

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res
      .status(400)
      .send({ message: "An error occurs", errors: errors.array() });
  };
};

// helper
const checkUsernameUnique = async (value, { req }) => {
  try {
    const user = await db.User.findOne({ where: { username: value } });
    if (user) {
      throw new Error("Username already taken");
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkStoreNameUnique = async (value, { req }) => {
  try {
    const user = await db.User.findOne({ where: { storeName: value } });
    if (user) {
      throw new Error("Store name already taken");
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkEmailUnique = async (value, { req }) => {
  try {
    const user = await db.User.findOne({ where: { email: value } });
    if (user) {
      throw new Error("Email already taken");
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkPhoneUnique = async (value, { req }) => {
  try {
    const user = await db.User.findOne({ where: { phone: value } });
    if (user) {
      throw new Error("Phone number already taken");
    }
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  validateRegistration: validate([
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50")
      .custom(checkUsernameUnique),
    body("storeName")
      .trim()
      .notEmpty()
      .withMessage("Store name is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50")
      .custom(checkStoreNameUnique),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter with email format")
      .custom(checkEmailUnique),
    body("phone")
      .notEmpty()
      .withMessage("Phone is required")
      .isMobilePhone()
      .withMessage("Invalid phone number")
      .custom(checkPhoneUnique),
    body("address").notEmpty().withMessage("Address is required"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isStrongPassword({
        minLength: 8,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
      })
      .withMessage(
        "Password required minimal 8 characters, 1 uppercase, 1 symbol, and 1 number"
      )
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("Confirm password does not match with password");
        }
        return true;
      }),
    body("confirmPassword")
      .notEmpty()
      .withMessage("Confirm password is required")
      .isLength({ min: 8 })
      .withMessage("Minimum password length is 8 characters"),
  ]),

  validateLogin: validate([
    body("email").notEmpty().withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter with email format"),
    body("password").notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Minimum password length is 8 characters"),
  ]),


  validateSetPassword: validate([
    body("password")
      .notEmpty()
      .withMessage("password is required")
      .isStrongPassword({
      minLength: 6,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    })
      .withMessage("Password must be 6 letters long and contain at least 1 uppercase letter, 1 number, and 1 symbol")
      .custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
          throw new Error("confirm setPassword does not match with password");
        }
        return true;
      }),
  ]),

};
