const Room = require("../models/rooms");
const _ = require("lodash");

exports.createRoom = async (req, res) => {
  const roomExists = await Room.findOne({ name: req.body.name });
  if (roomExists) {
    return res.status(403).json({
      error: "Room already exists",
    });
  }

  const room = await new Room(req.body);
  await room.save();
  res.status(200).json({ ...room.transform() });
};

exports.getRoom = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["name","ASC"]';
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);

  Room.countDocuments(function (err, c) {
    count = c;
    let map = new Map([sort]);
    Room.find()
      .sort(Object.fromEntries(map))
      .then((data) => {
        let formatData = [];
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set("content-Range", `room ${range[0]}-${range[1] + 1}/${count}`);
        res.status(200).json(formatData);
      })
      .catch((err) => console.log(err));
  });
};
exports.roomById = (req, res, next, id) => {
  Room.findById(id).exec((err, data) => {
    if (err) return res.status(200).json({ id: "", message: "Room not found" });
    req.room = data;

    next();
  });
};
exports.getOneRoom = (req, res) => {
  let room = req.room;
  if (room) {
    res.json(room.transform());
  } else {
    res.status(400).json({ message: "Room not found" });
  }
};

// exports.updateLeaveType = (req, res) => {
//   let leavetype = req.leaveType;
//   leavetype = _.extend(leavetype, req.body);

//   leavetype.save((err, leavetype) => {
//     if (err) {
//       return res.status(403).json({ error: err });
//     }
//     res.status(200).json(leavetype.transform());
//   });
// };

// exports.deleteLeaveType = (req, res) => {
//   let leavetype = req.leaveType;
//   leavetype.remove((err) => {
//     if (err) {
//       return res.status(400).json({ error: err });
//     }
//     res.status(200).json({ message: "Leave type deleted successfully" });
//   });
// };
