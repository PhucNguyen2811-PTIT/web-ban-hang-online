const pool = require("../config/db");

// Lấy tất cả đơn hàng (Admin)
const getOrders = async (_, res) => {
  try {
    // Lấy đơn hàng + thông tin user
    const [orders] = await pool.query(`
      SELECT 
        o.orderID,
        o.status,
        o.createdAt,
        o.totalPrice,
        u.name AS userName,
        u.email
      FROM orders o
      JOIN users u ON o.userID = u.userID
      ORDER BY o.createdAt DESC
    `);

    // Lấy chi tiết sản phẩm cho từng đơn
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

// Cập nhật trạng thái đơn hàng (Admin)
const updateStatus = async (req, res) => {
  try {
    await pool.query("UPDATE orders SET status=? WHERE orderID=?", [
      req.body.status,
      req.params.id,
    ]);
    res.json({ message: "Updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update status failed" });
  }
};

// Tạo sản phẩm mới (Admin)
const createProduct = async (req, res) => {
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

// Cập nhật sản phẩm (Admin)
const updateProduct = async (req, res) => {
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

    // Update sản phẩm
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

    // Xóa specs cũ
    await conn.query("DELETE FROM productspecs WHERE productID=?", [productID]);

    // Thêm specs mới
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

// Xóa sản phẩm (Admin)
const deleteProduct = async (req, res) => {
  try {
    await pool.query("UPDATE products SET is_deleted=1 WHERE productID=?", [
      req.params.id,
    ]);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete product failed" });
  }
};

// Lấy doanh thu (Admin)
const getRevenue = async (req, res) => {
  try {
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE status='completed' ORDER BY createdAt DESC"
    );
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalOrders = orders.length;

    res.json({ totalRevenue, totalOrders, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Export tất cả hàm
module.exports = {
  getOrders,
  updateStatus,
  createProduct,
  updateProduct,
  deleteProduct,
  getRevenue,
};
