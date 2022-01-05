const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Chat = sequelize.define(
  "chat",
  {
    id: {
      type: DataTypes.STRING,
      unique: true,
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
