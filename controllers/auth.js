const User = require("../models/users");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const _ = require("lodash");
const mongoose = require("mongoose");
const expressJwt = require("express-jwt");

dotenv.config();

exports.signin = (req, res) => {
  //find the user based on email
  const { username, password } = req.body;
  //if error or no user
  User.findOne({ email: username }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exist. Please signup",
      });
    }
    // if user found make sure the email end the password match
    if (!user.authenticate(password)) {
      return res.status(300).json({
        error: "Email and password do not match",
      });
    }
    if (!user.isActivated) {
      return res.status(300).json({
        error: "your email is desaibled contact ur admin",
      });
    }
    //generte a token with user id and secret key
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 1300 });
    // return respons with user and token to frontend cleint
    const { _id, email, name } = user;
    res.json({ token, user: { _id, email, name } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.json({
    message: "Singout success",
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});
