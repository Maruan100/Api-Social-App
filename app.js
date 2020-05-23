"use strict"

const express = require('express');
const bodyParser = require('body-parser');
const user_routes = require('./routes/user');

const app = express();


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/api',user_routes);




module.exports = app;