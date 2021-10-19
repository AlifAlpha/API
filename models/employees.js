const mongoose = require("mongoose");

const employeesSchema = new mongoose.Schema({
  uid: {
    required: true,
    type: String,
    trim: true,
    uppercase: true,
  },
  name: {
    required: true,
    type: String,
    trim: true,
    uppercase: true,
  },

  phone: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    trim: true,
  },
});

employeesSchema.method("transform", function () {
  let obj = this.toObject();

  //id renaming

  obj.id = obj._id;
  delete obj._id;
  return obj;
});

module.exports = mongoose.model("Employee", employeesSchema);
