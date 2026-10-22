"use strict";
const bcrypt = require("bcryptjs");

// Demo accounts, all made up. Everyone who has a password uses: Password12!
const PEOPLE = [
  // [id, full name, email, birth date, join date, role]
  [1, "Yusuf Halim", "admin@example.com", "1990-02-01", "2021-07-01", 1],
  [2, "Nadia Rahman", "staff1@example.com", "1997-06-14", "2022-03-01", 2],
  [3, "Kevin Tanjung", "staff2@example.com", "1999-11-03", "2023-01-09", 2],
  [4, "Citra Anggraini", "staff3@example.com", "1994-08-22", "2021-10-04", 2],
  [5, "Rizky Firmansyah", "staff4@example.com", "2001-03-17", "2024-02-05", 2],
  [6, "Melati Hasibuan", "staff5@example.com", "1992-12-09", "2020-05-11", 2],
  [7, "Bayu Saputra", "staff6@example.com", "1998-05-30", "2023-08-14", 2],
  [8, "Intan Permata", "staff7@example.com", "2000-01-25", "2026-09-01", 2],
  [9, "Dimas Ardiansyah", "dimas@example.com", "2000-04-21", "2026-10-12", 2],
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const password = await bcrypt.hash("Password12!", 10);
    const now = new Date();
    const inviteExpires = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    const users = PEOPLE.map(([id, full_name, email, birth_date, join_date, role_id]) => {
      const pending = email === "dimas@example.com";
      return {
        id,
        full_name,
        email,
        birth_date,
        join_date,
        role_id,
        salary_id: id,
        password: pending ? null : password,
        set_token: pending ? "demo-invite-link" : null,
        set_token_expires_at: pending ? inviteExpires : null,
        createdAt: now,
        updatedAt: now,
      };
    });

    // SEED_DEMO_DATA=false keeps only the admin account.
    const demo = process.env.SEED_DEMO_DATA !== "false";
    await queryInterface.bulkInsert("Users", demo ? users : users.filter((u) => u.role_id === 1));
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { id: { [Sequelize.Op.in]: PEOPLE.map((p) => p[0]) } });
  },
};