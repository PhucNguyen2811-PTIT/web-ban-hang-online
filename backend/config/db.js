const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "123456",
  database: process.env.DB_NAME || "laptop_shop",
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: true,
  },
});

module.exports = pool;
