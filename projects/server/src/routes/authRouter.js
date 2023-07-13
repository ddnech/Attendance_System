const authController = require("../controllers/authController");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const router = require("express").Router();

// router.post(
//   "/register",
//   validatorMiddleware.validateRegistration,
//   authController.registerUser
// );

router.post(
  "/login",
  validatorMiddleware.validateLogin,
  authController.loginUser);

router.post(
  "/set-pass",
  validatorMiddleware.validateSetPassword,
  authController.resetPassword
)

module.exports = router;
