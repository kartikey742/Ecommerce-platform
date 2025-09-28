const express = require("express");

const {
  addProduct,
  editProduct,
  fetchAllProducts, 
  deleteProduct,
} = require("../../controllers/admin/products");

const { upload } = require("../../config/cloudinary");

const router = express.Router(); 
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct); 
router.get("/get", fetchAllProducts); 

module.exports = router;