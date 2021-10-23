const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  //hello
});

DepartmentSchema.method("transform", function () {
  let obj = this.toObject();

  //id renaming

  obj.id = obj._id;
  delete obj._id;
  return obj;
});

module.exports = mongoose.model("Department", DepartmentSchema);
