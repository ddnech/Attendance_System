const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");

const generateJWTToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      role_id: user.role_id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
  return token;
};

module.exports = {
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      const user = await db.User.findOne({
        where: {
          email,
        },
      });

      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          const token = generateJWTToken(user);
          return res.status(200).send({ message: "Login successful", token });
        } else {
          res.status(401).send({ error: "Invalid credentials" });
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).send({ error: "Internal server error" });
    }
  },

  async setPassword(req, res) {
    try {
      const { password } = req.body;
      const setPasswordToken = req.query.token;

      const existToken = await db.User.findOne({
        where: { setPasswordToken },
      });

      if (!existToken) {
        return res.status(404).send({
          message: "Token invalid",
        });
      }

      const tokenCA = new Date(existToken.setPasswordTokenExpired);
      const now = new Date();

      if (now > tokenCA) {
        return res.status(400).send({
          message: "token is already expired",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      existToken.password = hashedPassword;
      existToken.setPasswordToken = null;
      existToken.setPasswordTokenExpires = null;

      await existToken.save();

      return res.status(200).send({
        message: "Password has been set succesfully, try login now",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Internal Server Error",
      });
    }
  },
};
