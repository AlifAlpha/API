const Intnote = require("../models/internalNote");
const _ = require("lodash");

exports.createIntnote = async (req, res) => {
  const intnoteExists = await Intnote.findOne({
    name: req.body.name,
    start: req.body.start,
    end: req.body.end,
  });
  if (intnoteExists) {
    return res.status(403).json({
      error: "Internal Note already exists",
    });
  }
  console.log(req.body);
  const intnote = await new Intnote(req.body);
  await intnote.save();
  res.status(200).json({ message: "Your internal note has been submitted" });
};
exports.getIntnote = (req, res) => {
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

  Intnote.countDocuments(filter, function (err, c) {
    count = c;
    // console.log("hello", c);
    let map = new Map([sort]);
    Intnote.find(filter)
      .sort(Object.fromEntries(map))
      .skip(range[0])
      .limit(range[1] + 1 - range[0])
      .then((data) => {
        let formatData = [];
        console.log(data.length, range);
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set("Content-Range", `intnote ${range[0]}-${range[1] + 1}/${count}`);
        res.status(200).json(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
exports.getIntnoteById = (req, res, next, id) => {
  Intnote.findById(id).exec((err, data) => {
    if (err) {
      return res.status(200).json({ error: "Internal Note for DG not found" });
    }
    req.intnote = data;

    next();
  });
};
exports.getOneIntnote = (req, res) => {
  intnote = req.intnote;
  if (intnote) {
    res.set("Content-Range", `leave 0-1/1`);
    res.json(intnote.transform());
  } else
    res.status(200).json({
      id: "",
      message: "Note not found",
    });
};
exports.updateIntnote = (req, res) => {
  let intnote = req.intnote;
  intnote = _.extend(intnote, req.body);
  intnote.save((err, intnote) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    return res.status(200).json(intnote.transform());
  });
};
exports.deleteIntnote = (req, res) => {
  let intnote = req.intnote;

  intnote.remove((err, intnote) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json({
      message: "Internal note deleted successfully",
    });
  });
};
