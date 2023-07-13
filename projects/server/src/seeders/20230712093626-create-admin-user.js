'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const AdminPassword = await bcrypt.hash('SecretAdminKey12!', 10);

    return queryInterface.bulkInsert('Users', [
      { 
        username: 'Admin',
        full_name: 'David Tanri',
        email: 'admin@example.com',
        password: AdminPassword,
        birthdate: new Date(1985, 1, 1),
        join_date: new Date(2022, 1, 1),
        role_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', { email: 'admin@example.com' }, {});
  }
};
