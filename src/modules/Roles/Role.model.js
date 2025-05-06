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
    createdBy: {
      type: DataTypes.STRING,
      field: 'created_by'
    },
    updatedBy: {
      type: DataTypes.STRING,
      field: 'updated_by'
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_deleted'
    }
  }, {
    tableName: 'roles',
    timestamps: true,  // Automatically handles createdAt, updatedAt
    paranoid: true,    // Automatically handles deletedAt for soft deletes
    underscored: true, // Uses snake_case for field names in the database
    defaultScope: {
      where: {
        deletedAt: null
      }
    }
  });

module.exports = Role;