const Razorpay = require('razorpay');
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_yourkeyid", // Replace with your test key
  key_secret: process.env.RAZORPAY_KEY_SECRET || "yoursecretkey", // Replace with your test secret
});

module.exports = razorpay;