const r = require("express").Router();
const c = require("../controllers/product.controller");

r.get("/", c.getAll);
r.get("/featured", c.getFeatured);
r.get("/:id", c.getOne);

module.exports = r;
