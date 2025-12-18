// server.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_secret_key_here"; // tự đặt, đừng để trống

const app = express();
app.use(cors());
app.use(express.json());

// ---- HANDLE UNCAUGHT ERRORS ----
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

// ---- MYSQL CONNECTION POOL ----
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456", // sửa đúng pass MySQL
  database: "laptop_shop", // tên schema
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool
  .getConnection()
  .then((conn) => {
    console.log("✅ MySQL connection successful");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ MySQL connection error:", err);
  });

// ---- Helper: map specs DB -> object an toàn ----
function mapSpecsToObject(specs) {
  const obj = {};
  for (const s of specs) {
    if (!s.attribute) continue;
    const key = s.attribute
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/-/g, "_");
    obj[key] = s.value;
  }
  return obj;
}

// ---- GET ALL PRODUCTS ----
app.get("/api/products", async (req, res) => {
  try {
    const [products] = await pool.query(
      "SELECT * FROM products WHERE is_deleted = 0"
    );

    for (let p of products) {
      const [specs] = await pool.query(
        "SELECT attribute, value FROM productspecs WHERE productID = ?",
        [p.productID]
      );
      p.specs = mapSpecsToObject(specs);

      if (p.image) {
        try {
          p.images = JSON.parse(p.image);
          if (!Array.isArray(p.images)) p.images = [p.image];
        } catch {
          p.images = [p.image];
        }
      } else {
        p.images = [];
      }
    }

    res.json(products);
  } catch (err) {
    console.error("DB query failed:", err);
    res.status(500).json({ error: "DB query failed" });
  }
});
// lấy sản phẩm nổi bật
app.get("/api/products/featured", async (req, res) => {
  try {
    const [products] = await pool.query(
      "SELECT * FROM products WHERE featured = 1 AND is_deleted = 0"
    );

    for (let p of products) {
      const [specs] = await pool.query(
        "SELECT attribute, value FROM productspecs WHERE productID = ?",
        [p.productID]
      );
      p.specs = mapSpecsToObject(specs);

      if (p.image) {
        try {
          p.images = JSON.parse(p.image);
          if (!Array.isArray(p.images)) p.images = [p.image];
        } catch {
          p.images = [p.image];
        }
      } else {
        p.images = [];
      }
    }

    res.json(products);
  } catch (err) {
    console.error("Featured query failed:", err);
    res.status(500).json({ error: "DB query failed" });
  }
});

// ---- GET SINGLE PRODUCT BY ID ----
app.get("/api/products/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [products] = await pool.query(
      "SELECT * FROM products WHERE productID = ? AND is_deleted = 0",
      [id]
    );
    if (products.length === 0)
      return res.status(404).json({ error: "Product not found" });

    const product = products[0];

    const [specs] = await pool.query(
      "SELECT attribute, value FROM productspecs WHERE productID = ?",
      [id]
    );
    product.specs = mapSpecsToObject(specs);

    if (product.image) {
      try {
        product.images = JSON.parse(product.image);
        if (!Array.isArray(product.images)) product.images = [product.image];
      } catch {
        product.images = [product.image];
      }
    } else {
      product.images = [];
    }

    res.json(product);
  } catch (err) {
    console.error("DB query failed:", err);
    res.status(500).json({ error: "DB query failed" });
  }
});
// ---- SIGNUP ----
app.post("/api/signup", async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "Thiếu dữ liệu" });

  try {
    // Check email tồn tại chưa
    const [exist] = await pool.query(
      "SELECT userID FROM users WHERE email = ?",
      [email]
    );
    if (exist.length > 0)
      return res.status(400).json({ error: "Email đã tồn tại" });

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10);

    // Insert
    await pool.query(
      "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)",
      [name, email, hashedPwd, phone]
    );

    res.json({ message: "Đăng ký thành công" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0)
      return res.status(400).json({ error: "Sai email hoặc mật khẩu" });

    const user = users[0];

    // So sánh mật khẩu
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Sai email hoặc mật khẩu" });

    // Tạo token
    const token = jwt.sign(
      { userID: user.userID, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        userID: user.userID,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

/* ---------------------- CART: ADD TO CART ---------------------- */
app.post("/api/cart/add", async (req, res) => {
  const { userID, productID, quantity } = req.body;

  if (!userID || !productID)
    return res.status(400).json({ error: "Thiếu userID hoặc productID" });

  try {
    const [exist] = await pool.query(
      "SELECT cartID, quantity FROM tempcart WHERE userID = ? AND productID = ?",
      [userID, productID]
    );

    if (exist.length > 0) {
      await pool.query(
        "UPDATE tempcart SET quantity = quantity + ? WHERE cartID = ?",
        [quantity || 1, exist[0].cartID]
      );
    } else {
      await pool.query(
        "INSERT INTO tempcart (userID, productID, quantity) VALUES (?, ?, ?)",
        [userID, productID, quantity || 1]
      );
    }

    res.json({ message: "Đã thêm vào giỏ hàng" });
  } catch (err) {
    console.error("Add cart error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

/* ---------------------- CART: GET USER CART ---------------------- */
app.get("/api/cart/:userID", async (req, res) => {
  const { userID } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT 
        c.cartID, c.quantity,
        p.productID, p.name, p.image, p.price, p.discountPrice
       FROM tempcart c
       JOIN products p ON c.productID = p.productID
       WHERE c.userID = ?`,
      [userID]
    );

    res.json(rows);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

/* ---------------------- CART: UPDATE QUANTITY ---------------------- */
app.put("/api/cart/update", async (req, res) => {
  const { cartID, quantity } = req.body;

  if (!cartID || quantity < 1)
    return res.status(400).json({ error: "Sai dữ liệu" });

  try {
    await pool.query("UPDATE tempcart SET quantity=? WHERE cartID=?", [
      quantity,
      cartID,
    ]);
    res.json({ message: "Quantity updated" });
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

/* ---------------------- CART: DELETE ITEM ---------------------- */
app.delete("/api/cart/:cartID", async (req, res) => {
  try {
    await pool.query("DELETE FROM tempcart WHERE cartID=?", [
      req.params.cartID,
    ]);
    res.json({ message: "Removed" });
  } catch (err) {
    console.error("Delete cart error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});
/* ---------------------- CHECKOUT ---------------------- */
app.post("/api/checkout", async (req, res) => {
  const { userID, paymentMethod } = req.body;

  if (!userID) {
    return res.status(400).json({ error: "Missing userID" });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Lấy cart hiện tại của user
    const [cartItems] = await conn.query(
      "SELECT * FROM tempcart WHERE userID = ?",
      [userID]
    );

    if (cartItems.length === 0) {
      await conn.rollback();
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 2. Tạo order
    const [orderResult] = await conn.query(
      "INSERT INTO orders (userID, paymentMethod, status) VALUES (?, ?, ?)",
      [userID, paymentMethod || "cod", "pending"]
    );

    const orderID = orderResult.insertId;

    // 3. Copy item từ tempcart sang order_items
    for (const item of cartItems) {
      await conn.query(
        "INSERT INTO orderitems (orderID, productID, quantity) VALUES (?, ?, ?)",
        [orderID, item.productID, item.quantity]
      );
    }

    // 4. Xóa tempcart
    await conn.query("DELETE FROM tempcart WHERE userID = ?", [userID]);

    await conn.commit();
    conn.release();

    res.json({ message: "Checkout success", orderID });
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Checkout failed" });
  }
});
/* =========================================================================
   ADMIN MIDDLEWARE & ROUTES
   ========================================================================= */

// Middleware xác thực token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// Middleware kiểm tra quyền admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin resource only" });
  }
  next();
};

/* ---- ADMIN: GET ALL ORDERS ---- */
app.get("/api/admin/orders", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, u.name as userName, u.email 
      FROM orders o 
      JOIN users u ON o.userID = u.userID 
      ORDER BY o.createdAt DESC
    `);

    // Lấy chi tiết từng đơn
    for (let order of orders) {
      const [items] = await pool.query(
        `
        SELECT oi.*, p.name as productName, p.image 
        FROM orderitems oi
        JOIN products p ON oi.productID = p.productID
        WHERE oi.orderID = ?
      `,
        [order.orderID]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error("Admin orders error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM category");
    res.json(rows);
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

/* ---- ADMIN: UPDATE ORDER STATUS ---- */
app.put(
  "/api/admin/orders/:id/status",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    const { status } = req.body;
    try {
      await pool.query("UPDATE orders SET status = ? WHERE orderID = ?", [
        status,
        req.params.id,
      ]);
      res.json({ message: "Cập nhật trạng thái thành công" });
    } catch (err) {
      console.error("Update status error:", err);
      res.status(500).json({ error: "Lỗi server" });
    }
  }
);

/* ---- ADMIN: CREATE PRODUCT ---- */
app.post("/api/admin/products", verifyToken, verifyAdmin, async (req, res) => {
  // 1. Nhận thêm categoryID từ Frontend
  const {
    name,
    price,
    discountPrice,
    stock,
    description,
    image,
    specs,
    categoryID,
  } = req.body;

  const imageJson = Array.isArray(image)
    ? JSON.stringify(image)
    : JSON.stringify([image]);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 2. Thêm categoryID vào câu lệnh INSERT
    const [result] = await conn.query(
      "INSERT INTO products (name, price, discountPrice, stock, description, image, categoryID) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        price,
        discountPrice,
        stock,
        description,
        imageJson,
        categoryID || null,
      ]
    );
    const productID = result.insertId;

    // Thêm specs
    if (specs && Array.isArray(specs)) {
      for (const s of specs) {
        if (s.attribute && s.value) {
          await conn.query(
            "INSERT INTO productspecs (productID, attribute, value) VALUES (?, ?, ?)",
            [productID, s.attribute, s.value]
          );
        }
      }
    }

    await conn.commit();
    res.json({ message: "Thêm sản phẩm thành công", productID });
  } catch (err) {
    await conn.rollback();
    console.error("Add product error:", err);
    res.status(500).json({ error: "Lỗi server" });
  } finally {
    conn.release();
  }
});

/* ---- ADMIN: UPDATE PRODUCT ---- */
app.put(
  "/api/admin/products/:id",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    // 1. Nhận categoryID
    const {
      name,
      price,
      discountPrice,
      stock,
      description,
      image,
      specs,
      categoryID,
    } = req.body;
    const productID = req.params.id;

    const imageJson = Array.isArray(image)
      ? JSON.stringify(image)
      : JSON.stringify([image]);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 2. Thêm categoryID vào câu lệnh UPDATE
      await conn.query(
        "UPDATE products SET name=?, price=?, discountPrice=?, stock=?, description=?, image=?, categoryID=? WHERE productID=?",
        [
          name,
          price,
          discountPrice,
          stock,
          description,
          imageJson,
          categoryID || null,
          productID,
        ]
      );

      // Cập nhật specs (Xóa cũ thêm mới)
      if (specs && Array.isArray(specs)) {
        await conn.query("DELETE FROM productspecs WHERE productID = ?", [
          productID,
        ]);
        for (const s of specs) {
          if (s.attribute && s.value) {
            await conn.query(
              "INSERT INTO productspecs (productID, attribute, value) VALUES (?, ?, ?)",
              [productID, s.attribute, s.value]
            );
          }
        }
      }

      await conn.commit();
      res.json({ message: "Cập nhật sản phẩm thành công" });
    } catch (err) {
      await conn.rollback();
      console.error("Update product error:", err);
      res.status(500).json({ error: "Lỗi server" });
    } finally {
      conn.release();
    }
  }
);
/* ---- ADMIN: SOFT DELETE PRODUCT ---- */
app.delete(
  "/api/admin/products/:id",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      await pool.query(
        "UPDATE products SET is_deleted = 1 WHERE productID = ?",
        [req.params.id]
      );
      res.json({ message: "Xóa sản phẩm thành công (soft delete)" });
    } catch (err) {
      console.error("Delete product error:", err);
      res.status(500).json({ error: "Xóa sản phẩm thất bại" });
    }
  }
);

// ---- START SERVER ----
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
