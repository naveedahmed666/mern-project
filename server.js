require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Category API
app.use("/api/categories", require("./routes/categoryRoutes"));

// Product API
app.use("/api/products", require("./routes/productRoutes"));

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});