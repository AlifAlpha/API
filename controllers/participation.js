const Participation = require("../models/participation");
const _ = require("lodash");

exports.createParticipation = async (req, res) => {
  const participationExists = await Participation.findOne({
    name: req.body.name,
  });
  //   if (participationExists) {
  //     return res.status(403).json({
  //       error: "Participation already exists",
  //     });
  //   }

  const participation = await new Participation(req.body);
  await participation.save();
  res.status(200).json({ ...participation.transform() });
};

exports.getParticipation = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["name","ASC"]';
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);

  Participation.countDocuments(function (err, c) {
    count = c;
    let map = new Map([sort]);
    Participation.find()
      .sort(Object.fromEntries(map))
      .then((data) => {
        let formatData = [];
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set(
          "content-Range",
          `participation ${range[0]}-${range[1] + 1}/${count}`
        );
        res.status(200).json(formatData);
      })
      .catch((err) => console.log(err));
  });
};

exports.getParticipationById = (req, res, next, id) => {
  Participation.findById(id).exec((err, data) => {
    if (err)
      return res
        .status(200)
        .json({ id: "", message: "Participation not found" });
    req.participation = data;

    next();
  });
};

exports.getOneParticipation = (req, res) => {
  let participation = req.participation;
  if (participation) {
    res.json(participation.transform());
  } else {
    res.status(400).json({ message: "Participation not found" });
  }
};

exports.updateParticipation = (req, res) => {
  let participation = req.participation;
  participation = _.extend(participation, req.body);

  participation.save((err, participation) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    res.status(200).json(participation.transform());
  });
};

exports.deleteParticipation = (req, res) => {
  let participation = req.participation;
  participation.remove((err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ message: "Participation deleted successfully" });
  });
};
