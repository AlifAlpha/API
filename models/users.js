const mongoose = require("mongoose");
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  salt: String,
  isActivated: { type: Boolean, default: false },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});

/**
 * Virtual fields are additional for given model.
 * Their values can be set manually or automatically with defind functionallty
 * Keep in mind : virtual proprties don't get presisted in database
 * They only exist logically are not written to document's collection
 */

//virtual field
userSchema
  .virtual("password")
  .set(function (password) {
    //craete temprary variable called _password
    this._password = password;
    // generate a timestamp
    this.salt = uuidv1();
    //encryptpassword()
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};
userSchema.method("transform", function () {
  var obj = this.toObject();

  //Rename fieldss
  if (obj._id) {
    obj.id = obj._id;
    delete obj._id;
    // if (obj.cours) {
    //   obj.cours.id = obj.cours._id;
    //   delete obj.cours._id;
    // }
    // if (obj.city) {
    //   obj.city.id = obj.city._id;
    //   delete obj.city._id;
    // }
  }

  //

  return obj;
});
module.exports = mongoose.model("User", userSchema);
