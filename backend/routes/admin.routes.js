const r = require("express").Router();
const c = require("../controllers/admin.controller");
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

r.use(verifyToken, verifyAdmin);

r.get("/orders", c.getOrders);
r.put("/orders/:id/status", c.updateStatus);
r.post("/products", c.createProduct);
r.put("/products/:id", c.updateProduct);
r.delete("/products/:id", c.deleteProduct);
r.get("/revenue", c.getRevenue);

module.exports = r;
