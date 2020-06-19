'use strict'
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageShema = Schema({
    text: String,
    file: String,
    viwed: String,
    createdAt: String,
    emitter: {type: Schema.ObjectId, ref: 'User'},
    receiver: {type: Schema.ObjectId, ref: 'User'},
});

module.exports = mongoose.model("Message", MessageShema);
