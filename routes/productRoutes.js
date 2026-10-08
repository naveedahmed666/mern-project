const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// ===============================
// MULTER STORAGE
// ===============================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname).toLowerCase();

    cb(null, uniqueName);
  },
});

// ===============================
// FILE FILTER
// Only PNG, JPG, JPEG
// ===============================

const fileFilter = function (req, file, cb) {
  const allowedExtensions = [".png", ".jpg", ".jpeg"];

  const extension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(extension)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only .png, .jpg and .jpeg files are allowed!"),
      false
    );
  }
};

// ===============================
// MULTER CONFIGURATION
// ===============================

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// ===============================
// PRODUCT ROUTES
// ===============================

router.post("/", upload.single("image"), createProduct);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put("/:id", upload.single("image"), updateProduct);

router.delete("/:id", deleteProduct);
module.exports = router;