const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const ChatMembership = sequelize.define(
  'chatMembership',
  {
    userId: {
      type: DataTypes.INTEGER,
      foreignKey: true,
    },
    chatId: {
      type: DataTypes.STRING,
      foreignKey: true,
    },
    right: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    wrong: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
);

module.exports = ChatMembership;
