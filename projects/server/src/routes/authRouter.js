const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { verifyToken } = require("../middleware/authMiddleware");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const router = require("express").Router();

// router.post(
//   "/register",
//   validatorMiddleware.validateRegistration,
//   authController.registerUser
// );

router.post(
  "/login",
  //validatorMiddleware.validateLogin,
  authController.loginUser);

router.post(
  "/set-pass",
  //validatorMiddleware.validateSetPassword,
  authController.setPassword
)

router.get(
  "/role-id",verifyToken,authController.getRole
)

router.get(
  "/profile",
  //validatorMiddleware.validateSetPassword,
  authController.getUserProfileToken
)
router.get(
  "/user-profile",
  authMiddleware.verifyToken,
  //validatorMiddleware.validateSetPassword,
  authController.getUserProfile
)

module.exports = router;
