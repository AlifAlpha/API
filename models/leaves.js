const mongoose = require("mongoose");
const LeaveType = require("./leaveTypes");
const Employee = require("./employees");
const { ObjectId } = mongoose.Schema;
const leaveSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  start: {
    required: true,
    type: Date,
  },
  end: {
    required: true,
    type: Date,
  },
  leaveType: {
    type: ObjectId,
    ref: LeaveType,
    required: true,
  },
  statu: {
    required: true,
    type: String,
    default: "pendding",
  },
  substitut: {
    type: ObjectId,
    ref: Employee,
    required: true,
  },
});

leaveSchema.method("transform", function () {
  let obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  return obj;
});

module.exports = mongoose.model("Leave", leaveSchema);
