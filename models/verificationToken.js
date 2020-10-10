const Sequelize = require('sequelize');
const { sequelize } = require('../services/initService');
const VerificationToken = sequelize.define('verification_tokens', {

  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    onUpdate: "cascade",
    onDelete: "cascade",
    references: { model: "users", key: "username" }
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdat: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedat: {
    allowNull: false,
    type: Sequelize.DATE
  }

}, { timestamps: false }
);


module.exports = VerificationToken;