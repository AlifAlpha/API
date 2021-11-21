const Department = require("../models/department");
const _ = require("lodash");

exports.createDepartment = async (req, res) => {
  const departmentExists = await Department.findOne({ name: req.body.name });
  if (departmentExists) {
    return res.status(403).json({
      error: "Department already exists",
    });
  }

  const department = await new Department(req.body);
  await department.save();
  res.status(200).json({ ...department.transform() });
};

exports.getDepartment = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["name","ASC"]';
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);

  Department.countDocuments(function (err, c) {
    count = c;
    let map = new Map([sort]);
    Department.find()
      .sort(Object.fromEntries(map))
      .then((data) => {
        let formatData = [];
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set(
          "content-Range",
          `department ${range[0]}-${range[1] + 1}/${count}`
        );
        res.status(200).json(formatData);
      })
      .catch((err) => console.log(err));
  });
};

exports.getDepartmentById = (req, res, next, id) => {
  Department.findById(id).exec((err, data) => {
    if (err)
      return res.status(200).json({ id: "", message: "Department not found" });
    req.department = data;

    next();
  });
};

exports.getOneDepartment = (req, res) => {
  let department = req.department;
  if (department) {
    res.json(department.transform());
  } else {
    res.status(400).json({ message: "Department not found" });
  }
};

exports.updateDepartment = (req, res) => {
  let department = req.department;
  department = _.extend(department, req.body);

  department.save((err, department) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    res.status(200).json(department.transform());
  });
};

exports.deleteDepartment = (req, res) => {
  let department = req.department;
  department.remove((err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ message: "Department deleted successfully" });
  });
};
