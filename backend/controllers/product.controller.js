const pool = require("../config/db");
const mapSpecs = require("../utils/mapSpecs");

const parseImages = (img) => {
  try {
    const arr = JSON.parse(img);
    return Array.isArray(arr) ? arr : [img];
  } catch {
    return img ? [img] : [];
  }
};

exports.getAll = async (req, res) => {
  try {
    const [products] = await pool.query(
      "SELECT * FROM products WHERE is_deleted = 0"
    );

    for (let p of products) {
      const [specs] = await pool.query(
        "SELECT attribute, value FROM productspecs WHERE productID = ?",
        [p.productID]
      );
      p.specs = mapSpecs(specs);
      p.images = parseImages(p.image);
    }

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const [products] = await pool.query(
      "SELECT * FROM products WHERE featured = 1 AND is_deleted = 0"
    );

    for (let p of products) {
      const [specs] = await pool.query(
        "SELECT attribute, value FROM productspecs WHERE productID = ?",
        [p.productID]
      );

      p.specs = mapSpecs(specs);
      p.images = parseImages(p.image);
    }

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM products WHERE productID = ? AND is_deleted = 0",
      [req.params.id]
    );

    if (!rows.length) return res.status(404).json({ error: "Not found" });

    const product = rows[0];

    const [specs] = await pool.query(
      "SELECT attribute, value FROM productspecs WHERE productID = ?",
      [product.productID]
    );

    product.specs = mapSpecs(specs);
    product.images = parseImages(product.image);

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "DB error" });
  }
};
