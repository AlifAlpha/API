const mongoose = require("mongoose");

const ineternlNote = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  dgParticipation: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  initiativeIs: {
    type: String,
    required: true,
  },
  ferequincy: {
    type: String,
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
  initiativeNeeds: [
    {
      type: String,
      required: true,
    },
  ],
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
  eventAttended: {
    type: String,
    required: true,
  },
  eventPartnership: [
    {
      type: String,
      required: true,
    },
  ],
  eventStateMember: {
    type: String,
    required: true,
  },
  numCoverage: {
    type: String,
    required: true,
  },
  coverageFor: [
    {
      type: String,
      required: true,
    },
  ],
  inpactInternal: {
    type: String,
    required: true,
  },
  internalSupport: [
    {
      type: String,
      required: true,
    },
  ],
  internalSupportNeededSup: {
    type: String,
  },
  internalSupportNeededSpo: {
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
