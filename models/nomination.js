const mongoose = require("mongoose");

const NominationSchema = new mongoose.Schema({
  firstname: {
    type: String,
    trim: true,
  },
  lastname: {
    type: String,
    trim: true,
  },
  birth: {
    type: String,
    trim: true,
  },
  nationality: {
    type: String,
    trim: true,
  },
  residence: {
    type: String,
    trim: true,
  },
  sex: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },

  certificates: {
    type: String,
    trim: true,
  },
  reason: {
    type: String,
    trim: true,
  },
  experience: {
    type: String,
    trim: true,
  },

  currentField: {
    type: String,
    trim: true,
  },
  currentWork: {
    type: String,
    trim: true,
  },
  employer: {
    type: String,
    trim: true,
  },
  workAddress: {
    type: String,
    trim: true,
  },
  employerPhone: {
    type: String,
    trim: true,
  },
  employerWebsite: {
    type: String,
    trim: true,
  },
  employerEmail: {
    type: String,
    trim: true,
  },
});

NominationSchema.method("transform", function () {
  let obj = this.toObject();

  //id renaming

  obj.id = obj._id;
  delete obj._id;
  return obj;
});

module.exports = mongoose.model("Nomination", NominationSchema);
