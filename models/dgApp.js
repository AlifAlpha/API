const mongoose = require("mongoose");

const DgAppSchema = new mongoose.Schema({
  // appType: {
  //   // required: true,
  //   inPerson: {
  //     meeting: { type: Boolean, default: false },
  //     visit: { type: Boolean, default: false },
  //     sign: { type: Boolean, default: false },
  //   },
  //   virtual: {
  //     visit: { type: Boolean, default: false },
  //     sign: { type: Boolean, default: false },
  //   },
  // },
  appType: {
    required: true,
    type: String,
    trim: true,
  },
  startMeet: {
    required: true,
    type: Date,
  },

  name: { required: true, type: String, trim: true },
  title: { required: true, type: String, trim: true },
  dateDurStart: {
    required: true,
    type: Date,
  },
  dateDurEnd: {
    type: Date,
  },

  purpose: { required: true, type: String, trim: true },
});

DgAppSchema.method("transform", function () {
  let obj = this.toObject();

  //id renaming

  obj.id = obj._id;
  delete obj._id;
  return obj;
});

module.exports = mongoose.model("DgApp", DgAppSchema);
