const db = require("../models");
const dayjs = require('dayjs');
const isToday = require('dayjs/plugin/isToday');
dayjs.extend(isToday);


module.exports = {
  async clockIn(req, res) {
    try {
      const userId = req.user.id;
  
      // if (!dayjs().isBusinessDay()) {
      //   return res.status(400).json({ error: "Today is not a business day." });
      // }
  
      const existingEntry = await db.AttendanceLog.findOne({
        where: {
          user_id: userId,
          date: {
            [db.Sequelize.Op.between]: [
              dayjs().startOf("day").toDate(),
              dayjs().endOf("day").toDate(),
            ],
          },
        },
      });
  
      if (existingEntry) {
        return res.status(400).json({ error: "User already clocked in today." });
      }
  
      await db.AttendanceLog.create({
        user_id: userId,
        clock_in: new Date(),
        status: "half-day",
        date: new Date(),
      });
  
      res.status(200).send({message: "Clock-in successful"});
    } catch (error) {
      console.error(error);
      res.status(500).send({message: "An error occurred while processing your request"});
    }
  },
  

  async clockOut(req, res) {
    try {
      const userId = req.user.id;
  
      const existingEntry = await db.AttendanceLog.findOne({
        where: {
          user_id: userId,
          date: {
            [db.Sequelize.Op.between]: [
              dayjs().startOf("day").toDate(),
              dayjs().endOf("day").toDate(),
            ],
          },
        },
      });
  
      if (!existingEntry) {
        return res.status(400).json({ error: "User has not clocked in today." });
      } else if (existingEntry.clock_out) {
        return res.status(400).json({ error: "User already clocked out today." });
      }
  
      await db.AttendanceLog.update(
        {
          clock_out: new Date(),
          status: "full-day",
        },
        {
          where: { id: existingEntry.id },
        }
      );
  
      res.status(200).send({message: "Clock-out successful"});
    } catch (error) {
      console.error(error);
      res.status(500).send({message: "An error occurred while processing your request"});
    }
  },
  
};
