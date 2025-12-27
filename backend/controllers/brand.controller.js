const db = require("../config/db");

exports.getBrands = async (req, res) => {
  try {
    const sql = `
      SELECT DISTINCT brand
      FROM products
      WHERE brand IS NOT NULL AND brand <> ''
    `;
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};
