const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      defaultValue: "noname",
    },
  },
  {
    sequelize,
    timestamps: false,
  }
);

module.exports = User;
