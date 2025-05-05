const User = require('../modules/User/User.model');
const Role = require('../modules/Roles/Role.model');
const { sequelize } = require('../utils/connectDb');

// Define associations
User.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role'
});

Role.hasMany(User, {
    foreignKey: 'roleId',
    as: 'users'
});

module.exports = {
    sequelize,
    User,
    Role
};