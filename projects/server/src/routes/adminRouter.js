const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const router = require("express").Router();

router.post(
  "/register",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  validatorMiddleware.validateRegisterStaff,
  adminController.registerUser
);

router.get(
  "/users",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  adminController.getAllUsers
);

module.exports = router;
