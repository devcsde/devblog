const mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");


const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  created: {
    type: Date,
    default: Date.now
  },
  admin: {
    type: Boolean,
    default: false
  }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);