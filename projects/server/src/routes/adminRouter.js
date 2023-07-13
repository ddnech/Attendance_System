const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
// const validatorMiddleware = require("../middleware/validatorMiddleware");
const router = require("express").Router();


router.post(
  "/register",
  authMiddleware.verifyToken,
  adminController.registerUser);

module.exports = router;