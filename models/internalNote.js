const mongoose = require("mongoose");

const internalNote = new mongoose.Schema({
  referencing: {
    type: String,
  },
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
    // required: true,
  },
  speechPoints: {
    type: String,
    // required: true,
  },
  speechDuration: {
    type: String,
    // required: true,
  },
  speechDate: {
    type: Date,
    // required: true,
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
  inpactInternal: [
    {
      type: String,
      required: true,
    },
  ],
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

internalNote.pre("save", function (next) {
  if (this.isNew) {
    let refName = "";
    let deptName = "";
    if (this.location.includes("Room")) {
      deptName = this.departmentName.split("-")[1];
      refName = `IN/${deptName}`;
    } else {
      if (this.stakeHoldersMember) deptName = "MS";
      else if (this.stakeHoldersNoMember) deptName = "NMS";
      else if (this.stakeHolderspartner) deptName = "PR";

      refName = `EX/${deptName}`;
    }
    const func = (x, y) => {
      let num;
      if (x < 10) {
        num = "00" + x.toString(10);
      } else if (x < 100) {
        num = "0" + x.toString(10);
      } else {
        num = x.toString(10);
      }
      let generetedName = `${y}/${new Date()
        .getFullYear()
        .toString()
        .substr(-2)}-${new Date().getMonth()}/${num}`;
      this.referencing = generetedName;
      exports.ref = generetedName;
      // console.log("In Pre save", this);
      next();
    };
    mongoose.model("InternalNote").countDocuments({}, async (err, count) => {
      let x = await count;
      func(x + 1, refName);
    });
  } else {
    next();
  }
});

internalNote.method("transform", function () {
  var obj = this.toObject();
  //Rename fields
  obj.id = obj._id;
  delete obj._id;
  return obj;
});

module.exports = mongoose.model("InternalNote", internalNote);
