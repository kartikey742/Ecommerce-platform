const razorpay = require("../../config/razorpay");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const crypto = require('crypto');

const createOrder = async (req, res) => {
  try {
    const {
      userId, 
      cartItems,
      addressInfo, 
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate, 
      cartId,
    } = req.body;

    // Create Razorpay order
    const options = {
      amount: Math.round(totalAmount * 100), // Amount in paise (multiply by 100)
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        userId: userId,
        cartId: cartId
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create order in database
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: "pending",
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: razorpayOrder.id,
      payerId: "",
    });

    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      orderId: newlyCreatedOrder._id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });

  } catch (e) {
    console.log("Razorpay Error:", e);
    
    // Handle specific Razorpay errors
    if (e.statusCode === 401) {
      return res.status(500).json({
        success: false,
        message: "Payment gateway authentication failed. Please contact support.",
      });
    }
    
    res.status(500).json({
      success: false,
      message: e.message || "Failed to create order. Please try again.",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    // Verify Razorpay signature
    const body = paymentId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "yoursecretkey")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpaySignature) {
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = razorpayPaymentId;
      order.payerId = razorpaySignature;

      for (let item of order.cartItems) {
        let product = await Product.findById(item.productId);

        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Not enough stock for this product ${product.title}`,
          });
        }

        product.totalStock -= item.quantity;

        await product.save();
      }

      const getCartId = order.cartId;
      await Cart.findByIdAndDelete(getCartId);

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order confirmed",
        data: order,
      });
    } else {
      return res.status(400).json({ 
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId ,paymentStatus:'paid'  });

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

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};