const { Router } = require("express");
const c = require("../controllers");
const { anyone, adminOnly, staffOnly } = require("../middleware/auth");
const validate = require("../middleware/validators");

// Auth and account setup
const auth = Router();
auth.post("/login", validate.login, c.auth.login);
auth.get("/me", anyone, c.auth.me);
auth.get("/user-profile", anyone, c.auth.me); // older name for /me
auth.get("/role-id", anyone, c.auth.roleId); // older clients
auth.get("/invite/:token", c.auth.inviteInfo);
auth.get("/profile", c.auth.inviteInfo); // older name: /profile?token=...
auth.post("/set-pass", validate.setPassword, c.auth.setPassword);

// Staff: clocking in and out, history
const staff = Router();
staff.use(staffOnly);
staff.get("/check-attendance", c.staff.today);
staff.post("/clock-in", c.staff.clockIn);
staff.patch("/clock-out", c.staff.clockOut);
staff.get("/attendance/history", c.staff.attendanceHistory);
staff.get("/payroll/history", c.staff.payrollHistory);

// Admin: team overview and adding people
const admin = Router();
admin.use(adminOnly);
admin.post("/register", validate.registerStaff, c.admin.registerStaff);
admin.get("/users", c.admin.staffList);
admin.post("/users/:id/invite", c.admin.resendInvite);
admin.get("/users/:id/attendance", c.admin.staffAttendance);

module.exports = { auth, staff, admin };
