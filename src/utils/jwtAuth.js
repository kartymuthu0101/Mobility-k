const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../modules/User/User.model');
const Role = require('../modules/Roles/Role.model');

const generateToken = async (user) => {
    const userWithRole = await User.findByPk(user.id, {
        include: [{
            model: Role,
            as: 'role'
        }]
    });
    
    const permissions = userWithRole?.role?.permissions || [];

    const payload = {
        name: user.username,
        id: user.id,
        email: user.email,  
        permissions
    };

    const secret = process.env.JWT_SECRET || 'yourSecretKey';
    const options = { expiresIn: '2h' };

    return jwt.sign(payload, secret, options);
};

const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET || 'yourSecretKey';
    try {
        const decoded = jwt.verify(token, secret);
        const tokenPayload = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            permissions: decoded.permissions || []
        };
        return tokenPayload;
    } catch (err) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };