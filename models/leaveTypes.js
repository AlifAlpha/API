const mongoose = require("mongoose");

const leaveTypeSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
});

leaveTypeSchema.method("transform", function () {
  let obj = this.toObject();

  //id renaming

  obj.id = obj._id;
  delete obj._id;
  return obj;
});

module.exports = mongoose.model("LeaveType", leaveTypeSchema);
