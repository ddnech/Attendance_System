const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
const { ROLE } = require("../utils/roles");

/**
 * Checks the Bearer token. Pass role ids to limit who gets through:
 *   requireAuth()             -> anyone logged in
 *   requireAuth(ROLE.ADMIN)   -> admins only
 */
function requireAuth(...roles) {
  return (req, res, next) => {
    const [scheme, token] = (req.headers.authorization || "").split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) {
      return res.status(401).json({ message: "Please log in first." });
    }

    let payload;
    try {
      payload = jwt.verify(token, jwtSecret);
    } catch (error) {
      const message =
        error.name === "TokenExpiredError"
          ? "Your session has expired. Please log in again."
          : "Invalid token. Please log in again.";
      return res.status(401).json({ message });
    }

    if (roles.length && !roles.includes(payload.role_id)) {
      return res.status(403).json({ message: "You don't have access to this." });
    }

    req.user = payload;
    next();
  };
}

module.exports = {
  requireAuth,
  anyone: requireAuth(),
  adminOnly: requireAuth(ROLE.ADMIN),
  staffOnly: requireAuth(ROLE.STAFF),
};
