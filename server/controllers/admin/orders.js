const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ paymentStatus: 'paid' });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};
const updateOrderStatus = async (req, res) => {
    const { orderId, orderStatus } = req.body;
    try {
        const order=await Order.findByIdAndUpdate(orderId,{orderStatus},{new:true});
        return res.status(200).json({
            success:true,
            data:order
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Some error occurred!"
        });
    }}
module.exports = {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus
};