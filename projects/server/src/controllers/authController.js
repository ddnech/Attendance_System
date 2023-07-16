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
        }
      }

      res.status(401).send({ error: "Invalid email or password" });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).send({ error: "Internal server error" });
    }
  },

  async setPassword(req, res) {
    try {
      const { password, full_name, birth_date } = req.body;
      const set_token = req.query.token;

      const existToken = await db.User.findOne({
        where: { set_token },
      });

      if (!existToken) {
        return res.status(404).send({
          message: "Token invalid",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      if (full_name) {
        existToken.full_name = full_name;
      }
      if (birth_date) {
        existToken.birth_date = birth_date;
      }

      existToken.password = hashedPassword;
      existToken.set_token = null;

      await existToken.save();
      return res.status(200).send({
        message: "Account has been succesfully set, try login now",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Internal Server Error",
      });
    }
  },

  async getRole(req, res) {
    const userId = req.user.id;
    try {
      const user = await db.User.findByPk(userId);
  
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send({ role_id: user.role_id });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
  },

  async getUserProfileToken(req, res) {
    try {
      const userProfile = await db.User.findOne({
        where: {
          set_token: req.query.token,
        },
        attributes: { exclude: ["password"] },
      });

      if (!userProfile) {
        return res.status(400).send({
          message: "User profile not found",
        });
      }

      return res.status(200).send({
        message: "Successfully retrieved user profile",
        data: userProfile,
      });

    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Internal Server Error",
      });
    }
  },

  async getUserProfile(req, res) {
    try {
      const userProfile = await db.User.findOne({
        where: {
          id: req.user.id,
        },
        include: [
            {
                model: db.Salary,
                attributes: ['basic_salary'],
            }
        ],
        attributes: { exclude: ["password","set_token"] },
    });

      if (!userProfile) {
        return res.status(400).send({
          message: "User profile not found",
        });
      }

      return res.status(200).send({
        message: "Successfully retrieved user profile",
        data: userProfile,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Internal Server Error",
      });
    }
  },
};
