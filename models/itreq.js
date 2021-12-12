const mongoose = require("mongoose");

const ItreqSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
});

ItreqSchema.method("transform", function () {
  let obj = this.toObject();

  //id renaming

  obj.id = obj._id;
  delete obj._id;
  return obj;
});
module.exports = mongoose.model("Itreq", ItreqSchema);
