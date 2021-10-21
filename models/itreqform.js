const mongoose = require("mongoose");
const Department = require("./department");
const Employee = require("./employees");
const Itreq = require("./itreq");
const { ObjectId } = mongoose.Schema;
const itreqformSchema = new mongoose.Schema({
  eventName: {
    required: true,
    type: String,
    trim: true,
  },
  eventCoordinator: {
    type: ObjectId,
    ref: Employee,
    required: true,
  },
  phone: {
    required: true,
    type: String,
    trim: true,
  },
  department: {
    type: ObjectId,
    ref: Department,
    required: true,
  },
  start: {
    required: true,
    type: Date,
  },
  time: {
    required: true,
    type: String,
  },
  location: {
    required: true,
    type: String,
    trim: true,
  },
  itreq: {
    type: ObjectId,
    ref: Itreq,
    required: true,
  },
});

itreqformSchema.method("transform", function () {
  let obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  return obj;
});

module.exports = mongoose.model("Itreqform", itreqformSchema);
