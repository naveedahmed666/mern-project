const Product = require("../models/ProductModel");
const fs = require("fs");
const path = require("path");

// ===============================
// CREATE PRODUCT
// POST /api/products
// ===============================
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // Image required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const product = await Product.create({
      name: name?.trim(),
      description: description?.trim(),
      price,
      category: category?.trim(),
      image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product creation failed",
      error: error.message,
    });
  }
};

// ===============================
// GET ALL PRODUCTS
// GET /api/products
// ===============================
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ===============================
// GET SINGLE PRODUCT
// GET /api/products/:id
// ===============================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// ===============================
// UPDATE PRODUCT
// PUT /api/products/:id
// ===============================
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Save old image path
    const oldImage = product.image;

    // Update text fields
    if (req.body.name) {
      product.name = req.body.name.trim();
    }

    if (req.body.description) {
      product.description = req.body.description.trim();
    }

    if (req.body.price) {
      product.price = req.body.price;
    }

    if (req.body.category) {
      product.category = req.body.category.trim();
    }

    // If new image uploaded
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();

    // Delete old image if new image was uploaded
    if (req.file && oldImage) {
      const oldImagePath = path.join(__dirname, "..", oldImage);

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product update failed",
      error: error.message,
    });
  }
};

// ===============================
// DELETE PRODUCT
// DELETE /api/products/:id
// ===============================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete image from uploads folder
    if (product.image) {
      const imagePath = path.join(__dirname, "..", product.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete product from MongoDB
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product and image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product deletion failed",
      error: error.message,
    });
  }
};

// ===============================
// EXPORT
// ===============================

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};