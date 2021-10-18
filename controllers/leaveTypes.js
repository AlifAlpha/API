const LeaveType = require("../models/leaveTypes");
const _ = require("lodash");

exports.createLeaveType = async (req, res) => {
  const leaveExists = await LeaveType.findOne({ name: req.body.name });
  if (leaveExists) {
    return res.status(403).json({
      error: "Leave type already exists",
    });
  }

  const leavetype = await new LeaveType(req.body);
  await leavetype.save();
  res.status(200).json({ ...leavetype.transform() });
};

exports.getLeavesType = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["name","ASC"]';
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);

  LeaveType.countDocuments(function (err, c) {
    count = c;
    let map = new Map([sort]);
    LeaveType.find()
      .sort(Object.fromEntries(map))
      .then((data) => {
        let formatData = [];
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set(
          "content-Range",
          `leavetype ${range[0]}-${range[1] + 1}/${count}`
        );
        res.status(200).json(formatData);
      })
      .catch((err) => console.log(err));
  });
};

exports.leaveTypeById = (req, res, next, id) => {
  LeaveType.findById(id).exec((err, data) => {
    if (err)
      return res.status(200).json({ id: "", message: "Sick Leave not found" });
    req.leaveType = data;
    res.json(data.transform());

    next();
  });
};
exports.leaveTypeById = (req, res, next, id) => {
  LeaveType.findById(id).exec((err, data) => {
    if (err)
      return res.status(200).json({ id: "", message: "Sick Leave not found" });
    req.leaveType = data;

    next();
  });
};
exports.getOneLeaveType = (req, res) => {
  let leaveType = req.leaveType;
  if (leaveType) {
    res.json(leaveType);
  } else {
    res.status(400).json({ message: "Leave types not found" });
  }
};

exports.updateLeaveType = (req, res) => {
  let leavetype = req.leaveType;
  leavetype = _.extend(leavetype, req.body);

  leavetype.save((err, leavetype) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    res.status(200).json(leavetype);
  });
};

exports.deleteLeaveType = (req, res) => {
  let leavetype = req.leaveType;
  leavetype.remove((err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ message: "Leave type deleted successfully" });
  });
};
