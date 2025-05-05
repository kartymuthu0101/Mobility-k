const { DataTypes } = require('sequelize');
const { sequelize } = require('../../utils/connectDb');

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    created_by: {
        type: DataTypes.STRING
    },
    updated_by: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'roles',
    timestamps: true,
    paranoid: true, // Adds deletedAt for soft deletes
    defaultScope: {
        where: {
            deletedAt: null
        }
    }
});

module.exports = Role;