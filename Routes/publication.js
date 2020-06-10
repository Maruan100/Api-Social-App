'use strict'

const express = require('express');
const api = express.Router();
const { PublicationController } = require('../Controllers/publication');
const middleware_auth = require('../Middlewares/auth');
const mdAuth = middleware_auth.ensureAuth;
const mutipart = require('connect-multiparty');
const mdUploads =  mutipart({ uploadDir: './Uploads/Users/Publications' });

api.post('/publication',mdAuth,PublicationController.savePublication);
api.get('/publications/:page?',mdAuth,PublicationController.getPublications);
api.get('/publication/:id',mdAuth,PublicationController.getPublication);
api.delete('/publication/:id',mdAuth,PublicationController.deletePublication);
api.post('/publication-file/:id',[mdAuth,mdUploads],PublicationController.uploadImage);
api.get('/publication-file/:imageFile',mdAuth,PublicationController.getPublicationFile);

module.exports = api;
