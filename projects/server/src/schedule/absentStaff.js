// const schedule = require('node-schedule');
// const dayjs = require('dayjs');
// const isToday = require('dayjs/plugin/isToday');
// const db = require("../models");
// dayjs.extend(isToday);

// // const isBusinessDay = (date) => {
// //     // Returns true if the day is Monday - Friday (0 = Sunday, 6 = Saturday)
// //     return date.day() > 0 && date.day() < 6;
// // }

// const job = schedule.scheduleJob('* * * * *', async () => {
//     // Only run this job on business days
//     // if (!isBusinessDay(dayjs())) {
//     //     return;
//     // }

//     const users = await db.User.findAll();

//     for (const user of users) {
//         const attendanceLog = await db.AttendanceLog.findOne({
//             where: {
//                 user_id: user.id,
//                 date: {
//                     [db.Sequelize.Op.between]: [
//                         dayjs().startOf('day').toDate(),
//                         dayjs().endOf('day').toDate()
//                     ]
//                 }
//             }
//         });

//         if (!attendanceLog) {
//             await db.AttendanceLog.create({
//                 user_id: user.id,
//                 status: 'absent',
//                 date: dayjs().startOf('day').toDate()
//             });
//         }
//     }
// });
