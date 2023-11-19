const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { verifyToken } = require("../middleware/authMiddleware");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const router = require("express").Router();


router.post(
  "/login",
  validatorMiddleware.validateLogin,
  authController.loginUser);

router.post(
  "/set-pass",
  //validatorMiddleware.validateSetAccount,
  authController.setPassword
)

router.get(
  "/role-id",verifyToken,authController.getRole
)

router.get(
  "/profile",
  authController.getUserProfileToken
)
router.get(
  "/user-profile",
  authMiddleware.verifyToken,
  authController.getUserProfile
)

module.exports = router;
