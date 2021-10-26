const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
});

roomSchema.method("transform", function () {
  let obj = this.toObject();

  //id renaming

  obj.id = obj._id;
  delete obj._id;
  return obj;
});

module.exports = mongoose.model("Room", roomSchema);
