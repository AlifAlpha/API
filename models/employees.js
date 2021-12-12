const mongoose = require("mongoose");
const Department = require("./department");
const { ObjectId } = mongoose.Schema;

const employeesSchema = new mongoose.Schema({
  uid: {
    required: true,
    type: String,
    trim: true,
    uppercase: true,
  },
  title: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
    trim: true,
  },
  department: {
    type: ObjectId,
    ref: Department,
    required: true,
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
