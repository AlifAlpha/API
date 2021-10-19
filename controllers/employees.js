const Employee = require("../models/employees");
const _ = require("lodash");

exports.createEmployee = async (req, res) => {
  const employeeExists = await Employee.findOne({ uid: req.body.uid });
  if (employeeExists) {
    return res.status(403).json({
      error: "Employee already exists",
    });
  }
  console.log(req.body);
  const employee = await new Employee(req.body);
  await employee.save();
  res.status(200).json({ ...employee.transform() });
};

exports.getEmployees = (req, res) => {
  let range = req.query.range || "[0,9]";
  let sort = req.query.sort || '["uid","ASC"]';
  let count;
  range = JSON.parse(range);
  sort = JSON.parse(sort);

  Employee.countDocuments(function (err, c) {
    count = c;
    let map = new Map([sort]);
    Employee.find()
      .sort(Object.fromEntries(map))
      .then((data) => {
        let formatData = [];
        for (let i = 0; i < data.length; i++) {
          formatData.push(data[i].transform());
        }
        res.set(
          "content-Range",
          `employee ${range[0]}-${range[1] + 1}/${count}`
        );
        res.status(200).json(formatData);
      })
      .catch((err) => console.log(err));
  });
};

exports.employeeById = (req, res, next, id) => {
  Employee.findById(id).exec((err, data) => {
    if (err)
      return res.status(200).json({ id: "", message: "Employee not found" });
    req.employee = data;

    next();
  });
};

exports.getOneEmployee = (req, res) => {
  let employee = req.employee;
  if (employee) {
    res.json(employee.transform());
  } else {
    res.status(400).json({ message: "Employee not found" });
  }
};

exports.updateEmployee = (req, res) => {
  let employee = req.employee;
  employee = _.extend(employee, req.body);

  employee.save((err, leavetype) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    res.status(200).json(employee.transform());
  });
};

exports.deleteEmployee = (req, res) => {
  let employee = req.employee;
  employee.remove((err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  });
};
