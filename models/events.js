const mongoose = require("mongoose");
const eventsSchema = new mongoose.Schema({
  name: {
    require: true,
    type: String,
    trim: true,
  },
  choice: {
    require: true,
    type: String,
    trim: true,
  },
});
eventsSchema.method("transform", function () {
  var obj = this.toObject();

  //Rename fields
  obj.id = obj._id;
  delete obj._id;

  return obj;
});

module.exports = mongoose.model("Event", eventsSchema);
// test
