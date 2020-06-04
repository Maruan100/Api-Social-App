'use strict'
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const FollowShema = Schema({
  user: {type: Schema.ObjectId, ref:'User' },
  followed: {type: Schema.ObjectId, ref:'User'},
});

module.exports = mongoose.model("Follow", FollowShema);
