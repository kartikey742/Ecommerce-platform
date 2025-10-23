const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;  
const dbconnect =async()=>{
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected"); 
} 

dbconnect(); 
app.use(express.json());
const authRouter = require("./routes/authroutes");
const adminProductsRouter = require("./routes/admin/productRoutes");
const adminOrderRouter = require("./routes/admin/Order");
const shopProductsRouter = require("./routes/shop/productRoutes");
const shopCartRouter = require("./routes/shop/Cart");
const shopAddressRouter = require("./routes/Address");
const shopOrderRouter = require("./routes/shop/Order");
// const shopSearchRouter = require("./routes/shop/search-routes");
// const shopReviewRouter = require("./routes/shop/review-routes");

// const commonFeatureRouter = require("./routes/common/feature-routes");


app.use( 
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);   
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter); 

app.use("/api/shop/products", shopProductsRouter); 
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter); 
app.use("/api/shop/order", shopOrderRouter);
// app.use("/api/shop/search", shopSearchRouter); 
// app.use("/api/shop/review", shopReviewRouter);

// app.use("/api/common/feature", commonFeatureRouter); 
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));    