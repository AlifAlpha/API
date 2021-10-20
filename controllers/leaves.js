const Leaves = require("../models/leaves");
const _ = require("lodash");

exports.createLeave = async (req, res) => {
  const leaveExists = await Leaves.findOne({
    name: req.body.name,
    start: req.body.start,
    end: req.body.end,
  });
  if (leaveExists) {
    return res.status(403).json({
      error: "Leave already exists",
    });
  }
  console.log(req.body);
  const leave = await new Leaves(req.body);
  await leave.save();
  res.status(200).json({ ...leave.transform() });
};
exports.getLeaves = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["RegisteredAt" , "DESC"]';
  let filter = req.query.filter || "{}";
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);
  filter = JSON.parse(filter);
  if (filter.name) {
    filter.name = { $regex: ".*" + filter.name + ".*" };
  }
  if (filter.end) {
    let dateStr = new Date(filter.end);
    let nextDate = new Date(filter.end);
    nextDate.setDate(nextDate.getDate() + 1);
    console.log(dateStr, nextDate);
    filter.end = {
      $gte: new Date(dateStr),
      $lte: new Date(nextDate),
    };
  }
  if (filter.start) {
    let dateStr = new Date(filter.start);
    let nextDate = new Date(filter.start);
    nextDate.setDate(nextDate.getDate() + 1);
    console.log(dateStr, nextDate);
    filter.start = {
      $gte: new Date(dateStr),
      $lte: new Date(nextDate),
    };
  }
  if (filter.id) {
    filter._id = {
      $in: [...filter.id.map((c) => mongoose.Types.ObjectId(c))],
    };
    delete filter.id;
  }
  console.log(filter);

  Leaves.countDocuments(filter, function (err, c) {
    count = c;
    // console.log("hello", c);
    let map = new Map([sort]);
    Leaves.find(filter)
      .sort(Object.fromEntries(map))
      .skip(range[0])
      .limit(range[1] + 1 - range[0])
      .then((data) => {
        let formatData = [];
        console.log(data.length, range);
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set("Content-Range", `leaves ${range[0]}-${range[1] + 1}/${count}`);
        res.status(200).json(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
exports.getLeaveById = (req, res, next, id) => {
  Leaves.findById(id).exec((err, data) => {
    if (err) {
      return res.status(200).json({ error: "Leaves not found" });
    }
    req.leave = data;

    next();
  });
};
exports.getOneLeave = (req, res) => {
  leave = req.leave;
  if (leave) {
    res.set("Content-Range", `leave 0-1/1`);
    res.json(leave.transform());
  } else
    res.status(200).json({
      id: "",
      message: "leave not found",
    });
};
exports.updateLeave = (req, res) => {
  let leave = req.leave;
  leave = _.extend(leave, req.body);
  leave.save((err, leave) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    return res.status(200).json(leave.transform());
  });
};
// exports.deleteLeave = (req, res) => {};
