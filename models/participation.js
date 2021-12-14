const mongoose = require("mongoose");

const ParticipationSchema = new mongoose.Schema({
  namelatin: {
    type: String,
    trim: true,
  },
  namearabic: {
    type: String,
    trim: true,
  },
  datepLace: {
    type: String,
    trim: true,
  },
  nationality: {
    type: String,
    trim: true,
  },
  occupation: {
    type: String,
    trim: true,
  },
  adress: {
    type: String,
    trim: true,
  },
  teloffice: {
    type: String,
    trim: true,
  },
  telmobile: {
    type: String,
    trim: true,
  },
  emailoffice: {
    type: String,
    trim: true,
  },
  emailpersonal: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
});

ParticipationSchema.method("transform", function () {
  let obj = this.toObject();

  //id renaming

  obj.id = obj._id;
  delete obj._id;
  return obj;
});

module.exports = mongoose.model("Participation", ParticipationSchema);
