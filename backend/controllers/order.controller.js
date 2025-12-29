const pool = require("../config/db");

const checkout = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    console.log("Checkout request body:", req.body); // log request

    await conn.beginTransaction();

    const userID = req.body.userID;
    const paymentMethod = req.body.paymentMethod || "cod";

    const [cart] = await conn.query(
      `
      SELECT productID, SUM(quantity) AS quantity
      FROM tempcart
      WHERE userID=?
      GROUP BY productID
      `,
      [userID]
    );

    if (!cart.length) throw new Error("Empty cart");

    let subtotal = 0;
    const itemsWithPrice = [];

    for (const item of cart) {
      const [[product]] = await conn.query(
        "SELECT price FROM products WHERE productID=?",
        [item.productID]
      );

      if (!product)
        throw new Error(`Product not found for productID=${item.productID}`);

      subtotal += product.price * item.quantity;

      itemsWithPrice.push({
        productID: item.productID,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const shippingFee = subtotal > 20000000 ? 0 : 30000;
    const totalPrice = subtotal + shippingFee;

    const [o] = await conn.query(
      `INSERT INTO orders (userID, paymentMethod, status, totalPrice)
       VALUES (?, ?, ?, ?)`,
      [userID, paymentMethod, "pending", totalPrice]
    );

    for (const i of itemsWithPrice) {
      await conn.query(
        `INSERT INTO orderitems (orderID, productID, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [o.insertId, i.productID, i.quantity, i.price]
      );
    }

    await conn.query("DELETE FROM tempcart WHERE userID=?", [userID]);

    await conn.commit();

    res.json({ orderID: o.insertId, totalPrice });
  } catch (err) {
    await conn.rollback();
    console.error("Checkout error:", err); // log chi tiết
    res.status(500).json({ error: "Checkout failed", message: err.message }); // trả message về frontend
  } finally {
    conn.release();
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userID = req.user.userID;

    // Lấy tất cả đơn hàng của user
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE userID = ? ORDER BY createdAt DESC",
      [userID]
    );

    if (orders.length === 0) return res.json([]);

    // Lấy chi tiết sản phẩm cho từng order
    const placeholders = orders.map(() => "?").join(",");
    const [items] = await pool.query(
      `SELECT oi.orderID, oi.orderItemID, p.name AS productName, oi.quantity
       FROM orderitems oi
       JOIN products p ON oi.productID = p.productID
       WHERE oi.orderID IN (${placeholders})`,
      orders.map((o) => o.orderID)
    );

    const ordersWithItems = orders.map((order) => ({
      ...order,
      items: items.filter((i) => i.orderID === order.orderID),
    }));

    res.json(ordersWithItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// DELETE /api/order/:orderID
const deleteOrder = async (req, res) => {
  try {
    const userID = req.user.userID;
    const orderID = req.params.orderID;

    // Lấy đơn hàng
    const [[order]] = await pool.query(
      "SELECT * FROM orders WHERE orderID = ? AND userID = ?",
      [orderID, userID]
    );

    if (!order)
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    // Chỉ cho xóa nếu trạng thái pending
    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Chỉ có thể xóa đơn hàng đang chờ xử lý" });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Xóa chi tiết sản phẩm
      await conn.query("DELETE FROM orderitems WHERE orderID = ?", [orderID]);

      // Xóa đơn hàng
      await conn.query("DELETE FROM orders WHERE orderID = ?", [orderID]);

      await conn.commit();
      res.json({ message: "Xóa đơn hàng thành công" });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
// PUT /api/order/:orderID/cancel
const cancelOrder = async (req, res) => {
  try {
    const userID = req.user.userID;
    const orderID = req.params.orderID;

    // Lấy đơn hàng
    const [[order]] = await pool.query(
      "SELECT * FROM orders WHERE orderID = ? AND userID = ?",
      [orderID, userID]
    );

    if (!order)
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    // Chỉ cho hủy nếu trạng thái pending
    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Chỉ có thể hủy đơn hàng đang chờ xử lý" });
    }

    // Cập nhật trạng thái thành cancelled
    await pool.query(
      "UPDATE orders SET status = 'cancelled' WHERE orderID = ?",
      [orderID]
    );

    res.json({ message: "Đơn hàng đã được hủy" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  checkout,
  getMyOrders,
  deleteOrder,
  cancelOrder,
};
