const pool = require("../config/db");

exports.getAll = async (_, res) => {
  const [rows] = await pool.query("SELECT * FROM category");
  res.json(rows);
};
