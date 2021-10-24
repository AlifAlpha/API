const City = require("../models/cities");
const _ = require("lodash");

exports.createCity = async (req, res) => {
  const cityExists = await City.findOne({ name: req.body.name });
  if (cityExists) {
    return res.status(403).json({
      error: "City exist",
    });
  }

  const city = await new City(req.body);
  await city.save();
  res.status(200).json({ ...city.transform() });
};

exports.cityById = (req, res, next, id) => {
  City.findById(id).exec((err, data) => {
    if (err) {
      return res.status(400).json({ error: "City not found" });
    }
    req.city = data;
    res.json(data.transform());

    next();
  });
  // res.json({ text: "hello" });
};

exports.getCities = (req, res) => {
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
  City.countDocuments(function (err, c) {
    count = c;
    let map = new Map([sort]);
    City.find()
      .sort(Object.fromEntries(map))
      .skip(range[0])
      .limit(range[1] + 1 - range[0])
      .then((data) => {
        let formatData = [];
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set("Content-Range", `city ${range[0]}-${range[1] + 1}/${count}`);
        res.status(200).json(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.updateCity = (req, res) => {
  let city = req.city;
  city = _.extend(city, req.body);
  city.save((err, city) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    // return res.status(200).json(city);
  });
};

exports.deleteCity = (req, res) => {
  let city = req.city;

  city.remove((err, city) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
  });
};
