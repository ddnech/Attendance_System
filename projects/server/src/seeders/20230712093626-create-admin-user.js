'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const AdminPassword = await bcrypt.hash('Password12!', 10);

    return queryInterface.bulkInsert('Users', [
      { 
        full_name: 'David Tanri',
        email: 'admin@example.com',
        password: AdminPassword,
        birth_date: new Date(1985, 1, 1),
        join_date: new Date(2022, 1, 1),
        role_id: 1,
        salary_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        full_name: 'staff1',
        email: 'staff1@example.com',
        password: AdminPassword,
        birth_date: new Date(1985, 1, 1),
        join_date: new Date(2022, 1, 1),
        role_id: 2,
        salary_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        full_name: 'staff2',
        email: 'staff2@example.com',
        password: AdminPassword,
        birth_date: new Date(1985, 1, 1),
        join_date: new Date(2022, 1, 1),
        role_id: 2,
        salary_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', { email: 'admin@example.com' }, {});
  }
};
