// const schedule = require("node-schedule");
// const dayjs = require("dayjs");
// const db = require("../models");

// const calculatePayroll = async () => {
//   try {
//     const users = await db.User.findAll({
//       include: db.Salary,
//     });

//     for (const user of users) {
//       if (!user.Salary) {
//         console.log(`No salary found for user ${user.id}`);
//         continue; 
//       }

//       const startOfMonth = dayjs().startOf("month");
//       const endOfMonth = dayjs().endOf("month");

//       const totalBusinessDays = Array.from(
//         { length: endOfMonth.date() },
//         (_, i) => startOfMonth.clone().add(i, "day")
//       ).filter((d) => d.day() !== 0 && d.day() !== 6).length;

//       const dailySalary = user.Salary.basic_salary / totalBusinessDays;

//       const attendanceLogs = await db.AttendanceLog.findAll({
//         where: {
//           user_id: user.id,
//           date: {
//             [db.Sequelize.Op.between]: [
//               startOfMonth.toDate(),
//               endOfMonth.toDate(),
//             ],
//           },
//         },
//       });

//       let amount = 0;
//       let deductions = 0;

//       for (const log of attendanceLogs) {
//         switch (log.status) {
//           case "full-day":
//             amount += dailySalary;
//             break;
//           case "half-day":
//             amount += dailySalary / 2;
//             deductions += dailySalary / 2;
//             break;
//           case "absent":
//             deductions += dailySalary;
//             break;
//         }
//       }

//       await db.Payroll.create({
//         user_id: user.id,
//         date: dayjs().toDate(), // current date at the time payroll is generated
//         amount: Math.round(amount),
//         deductions: Math.round(deductions),
//         createdAt: new Date(),
//         updatedAt: new Date()
//       });
//     }
//   } catch (error) {
//     console.error(`Error calculating payroll: ${error}`);
//   }
// };

// const job = schedule.scheduleJob("* * *  * *", () => {
//     // Check if tomorrow is the first of the month
//     // if (dayjs().add(1, 'day').date() === 1) {
//     //   calculatePayroll();
//     // }
//     calculatePayroll();
//   });
