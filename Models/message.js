'use strict'
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageShema = Schema({
    text: String,
    createdAt: String,
    emmiter: {type: Schema.ObjectId, ref: 'User'},
    receiver: {type: Schema.ObjectId, ref: 'User'},
});

module.exports = mongoose.model("Message", MessageShema);
