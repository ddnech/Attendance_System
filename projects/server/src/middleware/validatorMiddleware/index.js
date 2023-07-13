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

  validateProduct: validate([
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Product name is required")
      .isLength({ max: 50 })
      .withMessage("Maximum character is 50"),
    body("price")
      .trim()
      .notEmpty()
      .withMessage("Price is required")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a valid number")
      .isLength({ max: 1000000000 })
      .withMessage("Price must not exceed 1,000,000,000"),
    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isLength({ max: 200 })
      .withMessage("Maximum character is 200"),
    body("stock")
      .notEmpty()
      .isInt({ gt: 0, lte: 999 })
      .withMessage("Stock must be a valid number and not exceed 999"),
  ]),

  updateProduct: validate([
    body("name")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Name must not exceed 50 characters"),
    body("price")
    .optional()
    .custom((value, { req }) => {
      if (value !== "" && isNaN(value)) {
        throw new Error("Price must be a valid number");
      }
      if (value !== "" && (parseFloat(value) <= 0 || parseFloat(value) > 1000000000)) {
        throw new Error("Price must be a valid number and not exceed 1000000000");
      }
      return true;
    }),
    body("description")
      .optional()
      .isLength({ max: 200 })
      .withMessage("Maximum character is 200"),
      body("stock")
      .optional()
      .custom((value, { req }) => {
        if (value !== "" && isNaN(value)) {
          throw new Error("Stock must be a valid number");
        }
        if (value !== "" && (parseInt(value) <= 0 || parseInt(value) > 999)) {
          throw new Error("Stock must be a valid number and not exceed 999");
        }
        return true;
      }),
  ]),

  validateLogin: validate([
    body("username").notEmpty().withMessage("Username is required"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Minimum password length is 8 characters"),
  ]),

  createCategory: validate([
    body("name")
      .notEmpty()
      .withMessage("Category name is required")
      .custom(async (value, { req }) => {
        try {
          const category = await db.Category.findOne({
            where: { name: value },
          });
          if (category) {
            throw new Error("Category name already exist");
          }
          return true;
        } catch (error) {
          throw new Error(error.message);
        }
      }),
  ]),

  updateCategory: validate([
    body("name")
      .notEmpty()
      .withMessage("Category name is required")
      .custom(async (value, { req }) => {
        try {
          const category = await db.Category.findOne({
            where: { name: value },
          });
          if (category) {
            throw new Error("Category name already exist");
          }
          return true;
        } catch (error) {
          throw new Error(error.message);
        }
      }),
  ]),

  addToCart: validate([
    body("quantity")
      .notEmpty()
      .withMessage("quantity is required")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer"),
  ]),

  checkoutAddress: validate([
    body("address").notEmpty().withMessage("Address is required"),
  ]),

  validateSetPassword: validate([
    body("setPassword")
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
        if (value !== req.body.confirmNewPassword) {
          throw new Error("confirm setPassword does not match with password");
        }
        return true;
      }),
  ]),

};
