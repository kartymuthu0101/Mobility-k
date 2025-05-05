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
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdBy: {
        type: DataTypes.DATE
    },
    updatedBy: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'users',
    timestamps: true,
    paranoid: true, // This will add deletedAt for soft deletes
    defaultScope: {
        where: {
            deletedAt: null
        }
    }
});

// Instance method for comparing password
User.prototype.comparePassword = async function(password) {
    return bcrypt.compare(password, this.passwordHash);
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