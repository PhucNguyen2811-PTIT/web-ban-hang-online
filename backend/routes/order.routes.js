const r = require("express").Router();
const c = require("../controllers/order.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

r.post("/checkout", c.checkout);
r.get("/my", verifyToken, c.getMyOrders);
r.put("/:orderID/cancel", verifyToken, c.cancelOrder);

module.exports = r;
