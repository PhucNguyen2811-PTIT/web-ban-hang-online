const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "laptop_shop",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
