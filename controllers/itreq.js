const Itreq = require("../models/itreq");
const _ = require("lodash");

exports.createItreq = async (req, res) => {
  const itreqExists = await Itreq.findOne({ name: req.body.name });
  if (itreqExists) {
    return res.status(403).json({
      error: "IT requirement already exists",
    });
  }

  const itreq = await new Itreq(req.body);
  await itreq.save();
  res.status(200).json({ ...itreq.transform() });
};

exports.getItreq = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["name","ASC"]';
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);

  Itreq.countDocuments(function (err, c) {
    count = c;
    let map = new Map([sort]);
    Itreq.find()
      .sort(Object.fromEntries(map))
      .then((data) => {
        let formatData = [];
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set("content-Range", `itreq ${range[0]}-${range[1] + 1}/${count}`);
        res.status(200).json(formatData);
      })
      .catch((err) => console.log(err));
  });
};
exports.getItreqById = (req, res, next, id) => {
  Itreq.findById(id).exec((err, data) => {
    if (err)
      return res.status(200).json({ id: "", message: "IT request not found" });
    req.itreq = data;

    next();
  });
};
exports.getOneItreq = (req, res) => {
  let itreq = req.itreq;
  if (itreq) {
    res.json(itreq.transform());
  } else {
    res.status(400).json({ message: "IT request not found" });
  }
};

exports.updateItreq = (req, res) => {
  let itreq = req.itreq;
  itreq = _.extend(itreq, req.body);

  itreq.save((err, itreq) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    res.status(200).json(itreq.transform());
  });
};

exports.deleteItreq = (req, res) => {
  let itreq = req.itreq;
  itreq.remove((err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ message: "IT request deleted successfully" });
  });
};
