const r = require("express").Router();
const c = require("../controllers/cart.controller");

r.post("/add", c.add);
r.get("/:userID", c.get);
r.put("/update", c.update);
r.delete("/:cartID", c.remove);

module.exports = r;
