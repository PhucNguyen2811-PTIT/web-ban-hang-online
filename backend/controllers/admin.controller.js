const pool = require("../config/db");

exports.getOrders = async (_, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT 
        o.orderID,
        o.status,
        o.createdAt,
        u.name AS userName,
        u.email,
        COALESCE(SUM(oi.price * oi.quantity), 0) AS totalPrice
      FROM orders o
      JOIN users u ON o.userID = u.userID
      LEFT JOIN orderitems oi ON o.orderID = oi.orderID
      GROUP BY o.orderID
      ORDER BY o.createdAt DESC
    `);

    for (let o of orders) {
      const [items] = await pool.query(
        `
        SELECT 
          oi.orderItemID,
          p.name AS productName,
          oi.quantity
        FROM orderitems oi
        JOIN products p ON oi.productID = p.productID
        WHERE oi.orderID = ?
        `,
        [o.orderID]
      );
      o.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Get orders failed" });
  }
};

exports.updateStatus = async (req, res) => {
  await pool.query("UPDATE orders SET status=? WHERE orderID=?", [
    req.body.status,
    req.params.id,
  ]);
  res.json({ message: "Updated" });
};

exports.createProduct = async (req, res) => {
  const {
    name,
    brand,
    price,
    discountPrice,
    stock,
    description,
    image,
    specs,
  } = req.body;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Insert product
    const [result] = await conn.query(
      `INSERT INTO products 
      (name, brand, price, discountPrice, stock, description, image, is_deleted) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        name,
        brand,
        price,
        discountPrice,
        stock,
        description,
        JSON.stringify(image),
      ]
    );

    const productID = result.insertId;

    // 2. Insert specs
    if (specs && typeof specs === "object") {
      for (const key in specs) {
        await conn.query(
          `INSERT INTO productspecs (productID, attribute, value)
           VALUES (?, ?, ?)`,
          [productID, key, specs[key]]
        );
      }
    }

    await conn.commit();
    res.json({ message: "Product created", productID });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Create product failed" });
  } finally {
    conn.release();
  }
};

exports.updateProduct = async (req, res) => {
  const {
    name,
    brand,
    price,
    discountPrice,
    stock,
    description,
    image,
    specs,
  } = req.body;

  const productID = req.params.id;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Update products
    await conn.query(
      `UPDATE products
       SET name=?, brand=?, price=?, discountPrice=?, stock=?, description=?, image=?
       WHERE productID=?`,
      [
        name,
        brand,
        price,
        discountPrice,
        stock,
        description,
        JSON.stringify(image),
        productID,
      ]
    );

    // 2. Xóa specs cũ
    await conn.query("DELETE FROM productspecs WHERE productID=?", [productID]);

    // 3. Insert specs mới
    if (specs && typeof specs === "object") {
      for (const key in specs) {
        if (specs[key]) {
          await conn.query(
            `INSERT INTO productspecs (productID, attribute, value)
             VALUES (?, ?, ?)`,
            [productID, key, specs[key]]
          );
        }
      }
    }

    await conn.commit();
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Update product failed" });
  } finally {
    conn.release();
  }
};

exports.deleteProduct = async (req, res) => {
  await pool.query("UPDATE products SET is_deleted=1 WHERE productID=?", [
    req.params.id,
  ]);
  res.json({ message: "Deleted" });
};
