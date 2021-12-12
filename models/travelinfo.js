const mongoose = require("mongoose");

const TravelinfoSchema = new mongoose.Schema({
  country: {
    required: true,
    type: String,
    trim: true,
  },
  name: {
    required: true,
    type: String,
    trim: true,
  },
  arrivalDate: {
    required: true,
    type: Date,
    trim: true,
  },

  arrivalFlightNum: {
    required: true,
    type: String,
    trim: true,
    uppercase: true,
  },
  FlightComing: {
    required: true,
    type: String,
    trim: true,
  },
  departureDate: {
    required: true,
    type: Date,
    trim: true,
  },

  departureFlightNum: {
    required: true,
    type: String,
    trim: true,
    uppercase: true,
  },
});

TravelinfoSchema.method("transform", function () {
  let obj = this.toObject();

  //id renaming

  obj.id = obj._id;
  delete obj._id;
  return obj;
});

module.exports = mongoose.model("travelinfo", TravelinfoSchema);
