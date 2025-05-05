// src/database/seeders/20250501000002-demo-users.js
'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await queryInterface.bulkInsert('users', [
      {
        id: '9a8f7e6d-5c4b-3a2d-1e2f-3a4b5c6d7e8f',
        username: 'admin',
        email: 'admin@example.com',
        passwordHash: hashedPassword,
        status: true,
        roleId: '7c4e2fd2-9c6a-4c1f-9b3a-4a5d8c2e1f3d', // Match the role ID from the roles seeder
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};