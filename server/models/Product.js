const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    productImage: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: { type: Number, default: 0 },
    totalStock: Number,
    averageReview: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);