const Event = require("../models/events");
const _ = require("lodash");
exports.createEvent = async (req, res) => {
  const eventExists = await Event.findOne({ name: req.body.name });
  if (eventExists) {
    return res.status(403).json({ error: "Event exist" });
  }
  const event = await new Event(req.body);
  await event.save();
  res.status(200).json({ ...event.transform() });
};

exports.getEventById = (req, res, next, id) => {
  Event.findById(id).exec((err, data) => {
    if (err)
      return res.status(200).json({ id: "", message: "event not found" });
    req.event = data;

    next();
  });
};
exports.getOneEvent = (req, res) => {
  let event = req.event;
  if (event) {
    res.json(event.transform());
  } else {
    res.status(400).json({ message: "event not found" });
  }
};

exports.getEvents = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["_id" , "ASC"]';
  let filter = req.query.filter || "{}";
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);
  filter = JSON.parse(filter);
  if (filter.name) {
    filter.name = { $regex: ".*" + filter.name + ".*" };
  }
  Event.countDocuments(function (err, c) {
    count = c;
    let map = new Map([sort]);
    Event.find()
      .sort(Object.fromEntries(map))
      .skip(range[0])
      .limit(range[1] + 1 - range[0])
      .then((data) => {
        let formatData = [];
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set("Content-Range", `event ${range[0]}-${range[1] + 1}/${count}`);
        res.status(200).json(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.updateEvent = (req, res) => {
  let event = req.event;
  event = _.extend(event, req.body);
  event.save((err, event) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    return res.status(200).json(event);
  });
};

exports.deleteEvent = (req, res) => {
  let event = req.event;

  event.remove((err, event) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    return res.status(200).json({ message: "events deleted" });
  });
};
