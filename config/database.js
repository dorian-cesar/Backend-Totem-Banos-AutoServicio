// config/database.js
require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    schema: process.env.DB_SCHEMA,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

console.log(process.env.DB_SCHEMA);
module.exports = sequelize;
