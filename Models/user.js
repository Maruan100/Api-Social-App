'use strict'
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserShema = Schema({
  name: String,
  surname: String,
  nick: String,
  email: String,
  password: String,
  role: String,
  image: String,
  bio: String
});

module.exports = mongoose.model("User", UserShema);
