'use strict'

const express = require('express');
const mutipart = require('connect-multiparty');
const mdUploads =  mutipart({ uploadDir: './Uploads/Users/Avatars' });
const api = express.Router();
const UserControllers = require('../controllers/user');
const middleware_auth = require('../Middlewares/auth');
const mdAuth = middleware_auth.ensureAuth;

api.post('/register',UserControllers.saveUser)
api.post('/login',UserControllers.loginUser)
api.get('/user/:id',mdAuth,UserControllers.getUser)
api.get('/users/:page?',mdAuth,UserControllers.getUsers)
api.put('/edit-user/:id',mdAuth,UserControllers.updateUser)
api.post('/upload-user-image/:id',[mdAuth,mdUploads],UserControllers.uploadProfileImage)
api.get('/get-user-image/:imageFile',UserControllers.getProfileImage)
api.get('/counters/:id?',mdAuth,UserControllers.getCounters)


module.exports = api;