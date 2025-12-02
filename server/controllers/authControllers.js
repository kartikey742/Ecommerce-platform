const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require("mongoose");
//register
const registerUser = async (req, res) => {
  const {userName,email, password } = req.body; 
console.log('in register server');




  try {
    const checkUser = await User.findOne({ email }); 
    if (checkUser)
      return res.json({ 
        success: false,
        message: "User Already exists with the same email! Please try again",
      });
 
  
   await User.create({ 
      userName,
      email,
      password,
    });

    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured in registration",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({ 
        success: false,
        message: "User doesn't exists! Please register first",
      });

   
    if (password !== checkUser.password)
      return res.json({ 
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      process.env.JWT_SECRET || "fallback-secret-key",
      { expiresIn: "60m" }
    );


    res.cookie("token", token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000 // 1 hour
    }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//logout

const logoutUser = (req, res) => {
  console.log('reached logout');
  
  try{
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }).json({
      success: true,
      message: "Logged out successfully!",
    });
  }
  catch(e){
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured in logout",
    });
  }
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  try {
  const token = req?.cookies?.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "error in auth middleware!",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };