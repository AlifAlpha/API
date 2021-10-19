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

exports.getUserOne = (req, res, next, id) => {
  User.findById(id)
    .select("id name role email phoneNumber city isActivated created")
    .exec((err, data) => {
      req.user = data.transform();
      console.log(data);
      next();
    });
};

exports.getUserById = (req, res) => {
  user = req.user;
  if (user) {
    res.set("Content-Range", `user 0-1/1`);
    res.json(user);
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
