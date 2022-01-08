'use strict';

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const { DB_HOST } = process.env;
const { DB_PORT } = process.env;
const { DB_USER } = process.env;
const { DB_PASS } = process.env;
const { DB } = process.env;

module.exports = new Sequelize(DB, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  timestamps: false,
});
