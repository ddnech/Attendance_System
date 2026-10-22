const dayjs = require("dayjs");

// Monday to Friday. Public holidays aren't handled.
const isWorkday = (date) => {
  const day = dayjs(date).day();
  return day >= 1 && day <= 5;
};

/** "YYYY-MM-DD" for a day in the app's time zone. */
const dayKey = (date = new Date()) => dayjs(date).format("YYYY-MM-DD");

/** First and last day of a month, plus how many workdays it has. */
function monthInfo(year, month) {
  const start = dayjs().year(year).month(month - 1).startOf("month");
  const end = start.endOf("month");
  let workdays = 0;
  for (let d = start; !d.isAfter(end, "day"); d = d.add(1, "day")) {
    if (isWorkday(d)) workdays++;
  }
  return { start, end, workdays, from: start.format("YYYY-MM-DD"), to: end.format("YYYY-MM-DD") };
}

module.exports = { isWorkday, dayKey, monthInfo };
