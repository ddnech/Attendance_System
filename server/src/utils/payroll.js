/**
 * Works out pay for one month from the attendance statuses.
 *  - full day: paid a full day
 *  - half day: paid half, the other half is a deduction
 *  - absent:   the whole day is a deduction
 * A day's pay is the basic salary divided by the number of workdays in that month.
 * Shared by the monthly payroll job and the demo data seeder.
 */
function computePayroll({ basicSalary, workdays, statuses }) {
  const daily = workdays > 0 ? basicSalary / workdays : 0;
  let amount = 0;
  let deductions = 0;

  for (const status of statuses) {
    if (status === "full-day") amount += daily;
    if (status === "half-day") {
      amount += daily / 2;
      deductions += daily / 2;
    }
    if (status === "absent") deductions += daily;
  }

  return { amount: Math.round(amount), deductions: Math.round(deductions) };
}

module.exports = { computePayroll };
