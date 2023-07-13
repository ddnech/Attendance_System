const db = require("../models");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fs = require('fs');
const hbs = require("handlebars");

const transporter = nodemailer.createTransport({
  service: process.env.service_email,
  auth: {
    user: process.env.email_name, 
    pass: process.env.email_password, 
  },
});

module.exports = {
  async registerUser(req, res) {
    const {
      email,
      username,
      full_name,
      birthdate,
      join_date,
      role_id,
      salary,
    } = req.body;

    if (req.user.role_id !== 1) {

      res.status(403).send({
        message: "Unauthorized. Only admin can register a new user.",
      });
      return;
    }

    try {
      const isExist = await db.User.findOne({
        where: {
          [db.Sequelize.Op.or]: [{ email }, { username }],
        },
      });

      if (isExist) {
        res.status(400).send({
          message: "username / email already registered",
        });
        return;
      }

      // Check if the provided salary already exists
      let salary_id;
      if (salary) {
        const existingSalary = await db.Salary.findOne({
          where: { salary },
        });
        if (existingSalary) {
          salary_id = existingSalary.id;
        } else {
          const newSalary = await db.Salary.create({ salary });
          salary_id = newSalary.id;
        }
      }
      const verificationToken = crypto.randomBytes(20).toString('hex');
      
      const newUser = await db.User.create({
        email,
        username,
        full_name,
        birthdate,
        join_date,
        role_id,
        salary_id,
        verificationToken,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    const verificationLink = `${process.env.link_email}${verificationToken}`;
    const path = require('path');
    const templatePath = path.join(__dirname, '../templates/passwordAccount.html');

      // Read the email template file
    const template = fs.readFileSync(templatePath, "utf-8");
    // Compile the Handlebars template
    const templateCompile = hbs.compile(template);
    const htmlResult = templateCompile({ username, verificationLink });

    const mailOptions = {
      from: process.env.email_name,
      to: email,
      subject: 'Account Password Setup',
      html: htmlResult,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Internal server error');
      } else {
        console.log('Email sent:', info.response);
        res.status(201).send({
          message: 'Please set your password. An email has been sent.',
          email: newUser.email,
          username: newUser.username,
          full_name: newUser.full_name,
          birthdate: newUser.birthdate,
          join_date: newUser.join_date,
          role_id: newUser.role_id,
          salary_id: newUser.salary_id,
        });
      }
    });

    } catch (error) {
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },
};
