require("dotenv").config();
const app = require("./app");
const brandRoutes = require("./routes/brand.routes");
const orderRoutes = require("./routes/order.routes");

app.use("/api/brands", brandRoutes);
app.use("/api/order", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
