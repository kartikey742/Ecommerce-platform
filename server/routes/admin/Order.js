const express = require("express");

const {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
} = require("../../controllers/admin/orders");

const router = express.Router();

router.get("/get", getAllOrders);
router.get("/details/:id", getOrderDetails);
router.put("/update", updateOrderStatus);

module.exports = router;