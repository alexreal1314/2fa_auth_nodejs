const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const { sequelize } = require('../services/initService');
const VerificationToken = require('./verificationToken');


const User  = sequelize.define('users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    isVerified: {
        type: DataTypes.BOOLEAN
    },
    lastlogin: {
        type: DataTypes.DATE
    },
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE
    },
    updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
    }
});

User.hasOne(VerificationToken, { as: 'verificationtoken',foreignKey: 'username', foreignKeyConstraint: true });

module.exports = User;