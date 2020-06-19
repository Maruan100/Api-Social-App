"use strict";

const moment = require("moment");
const Message = require("../Models/message");

async function sendMessage(req, res) {
  let params = req.body;
  const user = req.user;

  if (!params.text || !params.receiver) return res.status(400).send({ message: 'Need filds text or receiver' })

  let message = new Message();
  message.emitter = user.sub;
  message.receiver = params.receiver;
  message.text = params.text;
  message.file = null;
  message.createdAt = moment().unix();

  message.save((err, messageStored) => {
    if (err) return res.status(500).send({ message: 'Server request error' })
    if (!messageStored) return res.status(400).send({ message: 'Can`t send this message, try later ' })
    return res.status(200).send({ message: messageStored })
  })

}

async function getMessages(req, res) {

  const userId = req.user.sub;
  const userReceiver = req.body.receiver;
  let messageList = [];

  let myMessages = await Message.find({ 'emitter': userId, 'receiver': userReceiver })

  let recivedMessages = await Message.find({ 'emitter': userReceiver, 'receiver': userId })

  myMessages.forEach(message => {
    messageList.push(message)
  });

  recivedMessages.forEach(message => {
    messageList.push(message)
  });

  if(messageList.length < 0) return res.status(404).send({ message: 'Can`t get any message, try later ' })

  const lastMessagesFirst = messageList.sort((a, b) =>  a.createdAt - b.createdAt)
  
  return res.status(200).send({ messages: lastMessagesFirst })

}


module.exports = {
  sendMessage,
  getMessages
}
