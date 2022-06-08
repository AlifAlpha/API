const mongoose = require("mongoose");
const LtipsSchema = new mongoose.Schema({
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
  languages: {
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
  leadershipcredentials: {
    type: String,
    trim: true,
  },

  recommandName: {
    type: String,
    trim: true,
  },
  recommandTitle: {
    type: String,
    trim: true,
  },
  recommandPhone: {
    type: String,
    trim: true,
  },
  recommandEmail: {
    type: String,
    trim: true,
  },
});

LtipsSchema.method("transform", function () {
  let obj = this.toObject();

  //id renaming

  obj.id = obj._id;
  delete obj._id;
  return obj;
});

module.exports = mongoose.model("Ltips", LtipsSchema);
