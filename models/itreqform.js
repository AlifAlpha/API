const mongoose = require("mongoose");
const Department = require("./department");
const Itreq = require("./itreq");
const { ObjectId } = mongoose.Schema;
const itreqformSchema = new mongoose.Schema({
  eventName: {
    required: true,
    type: String,
    trim: true,
  },
  eventCoordinator: {
    required: true,
    type: String,
    trim: true,
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
  duration: {
    required: true,
    type: String,
  },

  location: {
    type: String,
  },
  itreq: [
    {
      type: ObjectId,
      ref: Itreq,
      required: true,
    },
  ],
  company: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
});

itreqformSchema.pre("save", function (next) {
  // get the current date
  var currentDate = new Date();

  // if created_at doesn't exist, add to that field
  if (!this.createdAt) {
    console.log();
    console.log("In Pre save");
    this.createdAt = currentDate;
  }

  next();
});

itreqformSchema.method("transform", function () {
  let obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  return obj;
});

module.exports = mongoose.model("Itreqform", itreqformSchema);
