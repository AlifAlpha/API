const User = require("../models/users");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const _ = require("lodash");
const mongoose = require("mongoose");
const expressJwt = require("express-jwt"); // for authorisation

dotenv.config();

exports.createUsers = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(403).json({
      error: "Email is taken  !",
    });

  const user = await new User(req.body);
  await user.save();
  res.status(200).json({ message: req.body });
};

exports.getUsers = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["name" , "ASC"]';
  let filter = req.query.filter || "{}";
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);
  filter = JSON.parse(filter);
  if (filter.name) {
    filter.name = { $regex: ".*" + filter.name + ".*" };
  }
  if (filter.id) {
    filter._id = {
      $in: [...filter.id.map((c) => mongoose.Types.ObjectId(c))],
    };
    delete filter.id;
  }

  console.log(filter);
  User.countDocuments(filter, function (err, c) {
    count = c;
    let map = new Map([sort]);
    User.find(filter)
      .select("name role email phoneNumber city isActivated created")
      .sort(Object.fromEntries(map))
      .then((data) => {
        let formatData = [];
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set("Content-Range", `user ${range[0]}-${range[1] + 1}/${count}`);
        res.status(200).json(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.signin = (req, res) => {
  //find the user based on email
  const { email, password } = req.body;
  //if error or no user
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exist. Please signup",
      });
    }
    // if user found make sure the email end the password match
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
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

exports.getUserOne = (req, res, next, id) => {
  User.findById(id)
    .select("name role email phoneNumber city isActivated created")
    .exec((err, data) => {
      req.user = data;

      next();
    });
};

exports.getUserById = (req, res) => {
  user = req.user;
  if (user) {
    res.set("Content-Range", `user 0-1/1`);
    res.json(user.transform());
  } else res.status(200).json({ id: "", messsage: "User not found" });
};

exports.updateUser = (req, res) => {
  let user = req.user;
  user = _.extend(user, req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    return res.status(200).json(user.transform());
  });
};

exports.deleteUser = (req, res) => {
  let user = req.user;

  user.remove((err, user) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json({ message: "user deleted successfully" });
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
