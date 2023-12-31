const jwt = require("jsonwebtoken");
const db = require("../../models");

module.exports = {
  async verifyToken(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).send({
        message: "Token is not found",
      });
      return;
    }

    const [format, token] = authorization.split(" ");
    if (format.toLocaleLowerCase() === "bearer") {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!payload) {
          res.status(401).send({
            message: "Token verification failed",
          });
          return;
        }
        req.user = payload;
        next();
      } catch (error) {
        res.status(401).send({
          message: "Invalid token",
          error,
        });
      }
    }
  },

  async verifyAdmin(req, res, next) {
    if (req.user.role_id === 1) {
      console.log(req.user);
      return next();
    }
    res.status(401).send({
      message: "role is not allowed to access",
    });
  },

  async verifyStaff(req, res, next) {
    if (req.user.role_id === 2) {
      return next();
    }
    res.status(401).send({
      message: "role is not allowed to access",
    });
  },
};
