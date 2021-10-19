const mongoose = require("mongoose");

const employeesSchema = new mongoose.Schema({
  IID: {
    required: true,
    type: String,
    trim: true,
  },
  name: {
    required: true,
    type: String,
    trim: true,
  },
  Position: {
    required: true,
    type: String,
    trim: true,
  },
  Phone: {
    required: true,
    type: String,
    trim: true,
  },
  Email: {
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

module.exports = mongoose.model("Employee", employeesSchema);
