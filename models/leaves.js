const mongoose = require("mongoose");
const LeaveType = require("./leaveTypes");
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
    trim: true,
  },
  end: {
    required: true,
    type: Date,
    trim: true,
  },
  leaveType: {
    type: ObjectId,
    ref: LeaveType,
    required: true,
  },
  nDay: {
    type: ObjectId,
    ref: LeaveType,
    required: true,
  },
});
leaveSchema.pre("save", function (next) {
  // get the current date
  var currentDate = new Date();

  // if created_at doesn't exist, add to that field
  if (!this.RegisteredAt) {
    console.log();
    console.log("In Pre save");
    this.RegisteredAt = currentDate;
  }

  next();
});
leaveSchema.method("transform", function () {
  let obj = this.toObject();

  //id renaming

  obj.id = obj._id;
  delete obj._id;
  return obj;
});

module.exports = mongoose.model("Leave", leaveSchema);
