const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  name: {
    require: true,
    type: String,
    trim: true,
  },
});
citySchema.method("transform", function () {
  var obj = this.toObject();

  //Rename fields
  obj.id = obj._id;
  delete obj._id;

  return obj;
});

module.exports = mongoose.model("City", citySchema);
// test
