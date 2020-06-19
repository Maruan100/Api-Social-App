'use strict'

const express = require('express');
const mutipart = require('connect-multiparty');
const mdUploads =  mutipart({ uploadDir: './Uploads/Users/Avatars' });
const api = express.Router();
const  MessageControllers  = require('../controllers//message');
const middleware_auth = require('../Middlewares/auth');
const mdAuth = middleware_auth.ensureAuth;


api.post('/message',mdAuth,MessageControllers.sendMessage);
api.post('/get-message',mdAuth,MessageControllers.getMessages);

module.exports = api;