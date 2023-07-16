const db = require("../models");
const dayjs = require("dayjs");
const isToday = require("dayjs/plugin/isToday");
dayjs.extend(isToday);

function isWeekday() {
  const dayOfWeek = dayjs().day();
  return dayOfWeek >= 1 && dayOfWeek <= 5;
}

module.exports = {
  async clockIn(req, res) {
    try {
      const userId = req.user.id;

      if (!isWeekday()) {
        return res.status(400).send({ error: "Today is not a business day." });
      }
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
        return res
          .status(400)
          .json({ error: "User already clocked in today." });
      }

      await db.AttendanceLog.create({
        user_id: userId,
        clock_in: new Date(),
        status: "half-day",
        date: new Date(),
      });

      res.status(200).send({ message: "Clock-in successful" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while processing your request" });
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
        return res
          .status(400)
          .json({ error: "User has not clocked in today." });
      } else if (existingEntry.clock_out) {
        return res
          .status(400)
          .json({ error: "User already clocked out today." });
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

      res.status(200).send({ message: "Clock-out successful" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while processing your request" });
    }
  },

  async getAttendanceHistory(req, res) {
    const filters = {
      page: Number(req.query.page) || 1,
      year: Number(req.query.year) || dayjs().year(),
      month: Number(req.query.month) || dayjs().month() + 1,
      status: req.query.status
        ? req.query.status.split(",")
        : ["absent", "half-day", "full-day"],
      sort: req.query.sort || "DESC",
    };

    try {
      const startOfMonth = dayjs(`${filters.year}-${filters.month}-01`).startOf(
        "month"
      );
      const endOfMonth = startOfMonth.clone().endOf("month");

      const totalBusinessDays = Array.from(
        { length: endOfMonth.date() },
        (_, i) => startOfMonth.clone().add(i, "day")
      ).filter((d) => d.day() !== 0 && d.day() !== 6).length;

      const attendanceLogs = await db.AttendanceLog.findAndCountAll({
        where: {
          user_id: req.user.id,
          date: {
            [db.Sequelize.Op.between]: [
              startOfMonth.toDate(),
              endOfMonth.toDate(),
            ],
          },
          status: {
            [db.Sequelize.Op.in]: filters.status,
          },
        },
        order: [["date", filters.sort]],
      });

      const attendanceStatistics = {
        absent: 0,
        "half-day": 0,
        "full-day": 0,
        businessDays: totalBusinessDays,
      };

      for (const log of attendanceLogs.rows) {
        attendanceStatistics[log.status]++;
      }

      res.send({
        message: "Successfully retrieved attendance history",
        filters,
        statistics: attendanceStatistics,
        data: attendanceLogs.rows.map((log) => ({
          date: log.date,
          clockIn: log.clock_in,
          clockOut: log.clock_out,
          status: log.status,
        })),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "An error occurred while processing your request",
      });
    }
  },

  async payrollHistory(req, res) {
    const userId = req.user.id;
    const { year, month, sort } = req.query;

    const currentYear = year || dayjs().format("YYYY");
    const currentMonth = month || dayjs().format("MM");

    const whereClause = {
      user_id: userId,
    };

    whereClause[db.Sequelize.Op.and] = [
      db.Sequelize.where(
        db.Sequelize.fn("YEAR", db.Sequelize.col("date")),
        "=",
        currentYear
      ),
    ];

    if (month) {
      whereClause[db.Sequelize.Op.and].push(
        db.Sequelize.where(
          db.Sequelize.fn("MONTH", db.Sequelize.col("date")),
          "=",
          currentMonth
        )
      );
    }

    let orderClause = [];
    if (sort) {
      const [field, direction] = sort.split(",");
      orderClause.push([field, direction]);
    } else {
      orderClause.push(["date", "DESC"]);
    }

    try {
      const payrollRecords = await db.Payroll.findAll({
        where: whereClause,
        order: orderClause,
      });

      res.json(payrollRecords);
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  },

  async getAttendancePerDay(req, res) {
    try {
      const attendance = await db.AttendanceLog.findOne({
        where: {
          user_id: req.user.id,
          date: {
            [db.Sequelize.Op.between]: [
              dayjs().startOf("day").toDate(),
              dayjs().endOf("day").toDate(),
            ],
          },
        },
      });

      if (!attendance) {
        return res.status(200).send({
          message: "User has not clocked in or out today",
          data: {
            clock_in: null,
            clock_out: null,
          },
        });
      }

      const { clock_in, clock_out } = attendance;
      let message = "Successfully retrieved data";
      if (!clock_in) {
        message = "The staff has not clocked in yet";
      } else if (!clock_out) {
        message = `The staff clocked in at ${clock_in} and has not clocked out yet`;
      } else {
        message = `The staff clocked in at ${clock_in} and clocked out at ${clock_out}`;
      }

      res.status(200).send({ message: message, data: attendance });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .send({ message: "Fatal error on server.", error: error.errors });
    }
  },
};
