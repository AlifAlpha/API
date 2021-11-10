const Travelinfo = require("../models/travelinfo");
const _ = require("lodash");

exports.createTravelinfo = async (req, res) => {
  //   const travelExists = await Travelinfo.findOne({ name: req.body.name });
  //   if (travelExists) {
  //     return res.status(403).json({
  //       error: "Leave type already exists",
  //     });
  //   }

  const travelinfo = await new Travelinfo(req.body);
  await travelinfo.save();
  res.status(200).json({ ...travelinfo.transform() });
};

exports.getTravelinfo = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["name","ASC"]';
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);

  Travelinfo.countDocuments(function (err, c) {
    count = c;
    let map = new Map([sort]);
    Travelinfo.find()
      .sort(Object.fromEntries(map))
      .then((data) => {
        let formatData = [];
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set(
          "content-Range",
          `travelinfo ${range[0]}-${range[1] + 1}/${count}`
        );
        res.status(200).json(formatData);
      })
      .catch((err) => console.log(err));
  });
};
exports.travelinfoById = (req, res, next, id) => {
  Travelinfo.findById(id).exec((err, data) => {
    if (err)
      return res
        .status(200)
        .json({ id: "", message: "Travel information not found" });
    req.travelinfo = data;

    next();
  });
};
exports.getOneTravelinfo = (req, res) => {
  let travelinfo = req.travelinfo;
  if (travelinfo) {
    res.json(travelinfo.transform());
  } else {
    res.status(400).json({ message: "Travel information not found" });
  }
};

exports.updateTravelinfo = (req, res) => {
  let travelinfo = req.travelinfo;
  travelinfo = _.extend(travelinfo, req.body);

  travelinfo.save((err, travelinfo) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    res.status(200).json(travelinfo.transform());
  });
};

exports.deleteTravelinfo = (req, res) => {
  let travelinfo = req.travelinfo;
  travelinfo.remove((err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res
      .status(200)
      .json({ message: "Travel information deleted successfully" });
  });
};
