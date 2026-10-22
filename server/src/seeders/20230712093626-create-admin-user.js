"use strict";
const bcrypt = require("bcryptjs");

// Demo accounts. Everyone who has a password uses: Password12!
// Sari hasn't set up her account yet, so she shows up as "invite pending".
// Her setup link is  <APP_URL>/set-pass/demo-invite-link
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const password = await bcrypt.hash("Password12!", 10);
    const now = new Date();
    const inviteExpires = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    const users = [
      {
        id: 1,
        full_name: "David Tanri",
        email: "admin@example.com",
        password,
        birth_date: "1995-02-01",
        join_date: "2022-02-01",
        role_id: 1,
        salary_id: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        full_name: "Rina Wijaya",
        email: "staff1@example.com",
        password,
        birth_date: "1997-06-14",
        join_date: "2022-03-01",
        role_id: 2,
        salary_id: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        full_name: "Budi Santoso",
        email: "staff2@example.com",
        password,
        birth_date: "1999-11-03",
        join_date: "2023-01-09",
        role_id: 2,
        salary_id: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        full_name: "Sari Lestari",
        email: "sari@example.com",
        password: null,
        set_token: "demo-invite-link",
        set_token_expires_at: inviteExpires,
        birth_date: "2000-04-21",
        join_date: "2026-01-05",
        role_id: 2,
        salary_id: 4,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // SEED_DEMO_DATA=false keeps only the admin account.
    const demo = process.env.SEED_DEMO_DATA !== "false";
    await queryInterface.bulkInsert("Users", demo ? users : users.filter((u) => u.role_id === 1));
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { id: { [Sequelize.Op.in]: [1, 2, 3, 4] } });
  },
};
