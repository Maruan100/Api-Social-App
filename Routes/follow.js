'use strict'

const express = require('express');
const api = express.Router();
const { FollowController } = require('../Controllers/follow');
const middleware_auth = require('../Middlewares/auth');
const mdAuth = middleware_auth.ensureAuth;


api.post('/follow',mdAuth,FollowController.saveFollow);
api.delete('/follow/:id',mdAuth,FollowController.deleteFollow);
api.get('/follows/:id?/:page?',mdAuth,FollowController.getFollows);
api.get('/followers/:id?/:page?',mdAuth,FollowController.getFollowers);
api.get('/follow-list/:follows?',mdAuth,FollowController.getFollowsList);

module.exports = api;
