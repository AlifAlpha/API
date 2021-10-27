const mongoose = require("mongoose");
const Department = require("./department");
const { ObjectId } = mongoose.Schema;

const ineternlNote = new mongoose.Schema({
  departmentName: {
    require: true,
    type: ObjectId,
    ref: Department,
  },
  eventName: {
    require: true,
    type: String,
    required: true,
  },
  location: {
    require: true,
    type: String,
    required: true,
  },
  eventDate: {
    require: true,
    type: Date,
    required: true,
  },
  stakeHoldersMember: {
    type: String,
    trim: true,
  },
  stakeHoldersNoMember: {
    type: String,
    trim: true,
  },
  stakeHolderspartner: {
    type: String,
    trim: true,
  },
  initiativeNeeds: {
    type: String,
    required: true,
  },
  initiativeNeeds: {
    type: String,
    required: true,
  },
  speechTopic: {
    type: String,
    required: true,
  },
  speechPoints: {
    type: String,
    required: true,
  },
  speechDuration: {
    type: String,
    required: true,
  },
  speechDate: {
    type: Date,
    required: true,
  },

  speechDate: {
    type: Date,
    required: true,
  },

  eventAttended: {
    type: String,
    required: true,
  },
  eventPartnership: {
    type: String,
    required: true,
  },
  eventStateMember: {
    type: String,
    required: true,
  },
  numCoverage: {
    type: String,
    required: true,
  },
  coverageFor: {
    type: String,
    required: true,
  },
  inpactInternal: {
    type: String,
    required: true,
  },
  internalSupport: {
    type: String,
    required: true,
  },
  internalSupportNeededSup: {
    type: String,
  },
  DGDirections: {
    type: String,
  },
});
ineternlNote.method("transform", function () {
  var obj = this.toObject();

  //Rename fields
  obj.id = obj._id;
  delete obj._id;

  return obj;
});

module.exports = mongoose.model("IneternlNote", ineternlNote);
