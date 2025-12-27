const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/products", require("./routes/product.routes"));
app.use("/api", require("./routes/auth.routes"));
app.use("/api/cart", require("./routes/cart.routes"));
app.use("/api", require("./routes/order.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api", require("./routes/category.routes"));

module.exports = app;
