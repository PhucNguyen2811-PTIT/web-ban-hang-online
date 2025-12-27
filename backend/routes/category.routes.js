const r = require("express").Router();
const c = require("../controllers/category.controller");

r.get("/categories", c.getAll);

module.exports = r;
