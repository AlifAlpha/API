const mongoose = require("mongoose");
const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  date: {
    type: String,
    trim: true,
  },
  lieu: {
    type: String,
    trim: true,
  },
  organisation: {
    type: String,
    trim: true,
  },
  organizer: {
    type: String,
    trim: true,
  },
  language: {
    type: String,
    trim: true,
  },
  translation: {
    type: String,
    trim: true,
  },
  actionRequired: {
    type: String,
    trim: true,
  },
  contact: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  zoomLink: {
    type: String,
    trim: true,
  },
  meetingpassword: {
    type: String,
    trim: true,
  },
});
activitySchema.method("transform", function () {
  var obj = this.toObject();

  //Rename fields
  obj.id = obj._id;
  delete obj._id;

  return obj;
});

module.exports = mongoose.model("Activity", activitySchema);
