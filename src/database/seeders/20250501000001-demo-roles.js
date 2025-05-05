// src/database/seeders/20250501000001-demo-roles.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      {
        id: '7c4e2fd2-9c6a-4c1f-9b3a-4a5d8c2e1f3d',
        name: 'Admin',
        description: 'Administrator with full access',
        permissions: ['create', 'read', 'update', 'delete'],
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};