const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    chatId: {
      type: DataTypes.STRING,
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

module.exports = User;
