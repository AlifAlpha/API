const DgApp = require("../models/dgApp");
const _ = require("lodash");

exports.createDgApp = async (req, res) => {
  //   //   const dgAppExists = await DgApp.findOne({ name: req.body.name });
  //   //   if (dgAppExists) {
  //   //     return res.status(403).json({
  //   //       error: "Appointment already exists",
  //   //     });
  //   //   }
  //   console.log(req.body);
  //   const dgApp = await new DgApp(req.body);
  //   await dgApp.save();
  //   res.status(200).json(dgApp.transform());
};

exports.getDgApp = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["startMeet","DESC"]';
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);
  DgApp.countDocuments(function (err, c) {
    count = c;
    let map = new Map([sort]);
    DgApp.find()
      .sort(Object.fromEntries(map))
      .then((data) => {
        let formatData = [];
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set("content-Range", `dgApp ${range[0]}-${range[1] + 1}/${count}`);
        res.status(200).json(formatData);
      })
      .catch((err) => console.log(err));
  });
};

exports.getDgAppById = (req, res, next, id) => {
  //   DgApp.findById(id).exec((err, data) => {
  //     if (err)
  //       return res.status(200).json({ id: "", message: "Appointment not found" });
  //     req.dgApp = data;
  //     next();
  //   });
};

exports.getOneDgApp = (req, res) => {
  //   let dgApp = req.dgApp;
  //   if (dgApp) {
  //     res.json(dgApp.transform());
  //   } else {
  //     res.status(200).json({ id: "", message: "Appointment not found" });
  //   }
};

exports.updateDgApp = (req, res) => {
  //   let dgApp = req.dgApp;
  //   dgApp = _.extend(dgApp, req.body);
  //   dgApp.save((err, dgApp) => {
  //     if (err) {
  //       return res.status(403).json({ error: err });
  //     }
  //     res.status(200).json(dgApp.transform());
  //   });
};

exports.deleteDgApp = (req, res) => {
  //   let dgApp = req.dgApp;
  //   dgApp.remove((err) => {
  //     if (err) {
  //       return res.status(400).json({ error: err });
  //     }
  //     res.status(200).json({ message: "Appointment deleted successfully" });
  //   });
};
