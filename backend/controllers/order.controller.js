const pool = require("../config/db");

exports.checkout = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const userID = req.body.userID;
    const paymentMethod = req.body.paymentMethod || "cod";

    const [cart] = await conn.query(
      "SELECT productID, quantity FROM tempcart WHERE userID=?",
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

      if (!product) throw new Error("Product not found");

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
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  } finally {
    conn.release();
  }
};
