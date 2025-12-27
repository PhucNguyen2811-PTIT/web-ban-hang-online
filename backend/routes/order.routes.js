const r = require("express").Router();
const c = require("../controllers/order.controller");

r.post("/checkout", c.checkout);

module.exports = r;
