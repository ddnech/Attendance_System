const db = require("../models");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fs = require('fs');
const hbs = require("handlebars");
const dayjs = require('dayjs');

const transporter = nodemailer.createTransport({
  service: process.env.service_email,
  auth: {
    user: process.env.email_name, 
    pass: process.env.email_password, 
  },
});

module.exports = {
  async registerUser(req, res) {
    try {
      const { email, full_name, birth_date, join_date, salary } = req.body;
      console.log(salary);
  
      const transaction = await db.sequelize.transaction();
  
      try {
        const newSalary = await db.Salary.create(
          { basic_salary: salary },
          { transaction }
        );
  
        const set_token = crypto.randomBytes(20).toString('hex');
        const newUser = await db.User.create({
          email,
          full_name,
          birth_date,
          join_date,
          role_id: 2,
          set_token,
          salary_id: newSalary.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, { transaction });
  
        await transaction.commit();
  
        const verificationLink = `${process.env.link_email}${set_token}`;
        const path = require('path');
        const templatePath = path.join(__dirname, '../templates/passwordAccount.html');
  
  
        const template = fs.readFileSync(templatePath, "utf-8");
        const templateCompile = hbs.compile(template);
        const htmlResult = templateCompile({ username: newUser.username, verificationLink });
  
        const mailOptions = {
          from: process.env.email_name,
          to: email,
          subject: 'Account Setup',
          html: htmlResult,
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Internal server error');
          } else {
            console.log('Email sent:', info.response);
            res.status(201).send({
              message: 'Please set up the account. An email has been sent.',
              email: newUser.email,
              full_name: newUser.full_name,
              birth_date: newUser.birthdate,
              join_date: newUser.join_date,
              salary_id: newUser.salary_id,
            });
          }
        });
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      res.status(500).send({
        message: "Internal Server errorr",
        errors: error.message,
      });
    }
  },
  
};
