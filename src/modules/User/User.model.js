const { DataTypes } = require('sequelize');
const { sequelize } = require('../../utils/connectDb');
const bcrypt = require('bcrypt');


const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash'
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'role_id',
      references: {
        model: 'roles',
        key: 'id'
      }
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
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true,  
    underscored: true, 
  });

// Instance method for comparing password
User.prototype.comparePassword = async function(password) {
  console.log('Comparing:', password, 'with hash:', this.passwordHash);
  console.log( await bcrypt.compare(password, this.passwordHash))
  return await bcrypt.compare(password, this.passwordHash);
};
// Hook for hashing password before save
User.beforeCreate(async (user) => {
    if (user.changed('passwordHash')) {
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
    }
});

User.beforeUpdate(async (user) => {
    if (user.changed('passwordHash')) {
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
    }
});

module.exports = User;