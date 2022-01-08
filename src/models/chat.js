const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Chat = sequelize.define(
  'chat',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      defaultValue: 'noname',
    },
    memberCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    randNumber: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
);

module.exports = Chat;
