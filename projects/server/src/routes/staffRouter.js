
const staffController = require("../controllers/staffController");
const authMiddleware = require("../middleware/authMiddleware");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const router = require("express").Router();


router.post("/clock-in",authMiddleware.verifyToken, staffController.clockIn);
router.patch("/clock-out",authMiddleware.verifyToken, staffController.clockOut);
router.get('/attendance/history',authMiddleware.verifyToken,staffController.getAttendanceHistory);
router.get('/payroll/history',authMiddleware.verifyToken,staffController.payrollHistory);
router.get('/check-attendance',authMiddleware.verifyToken,staffController.getAttendancePerDay);


module.exports = router;
