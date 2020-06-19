"use strict"

const express = require('express');
const bodyParser = require('body-parser');
const user_routes = require('./routes/user');
const follow_routes = require('./Routes/follow');
const publication_routes = require('./Routes/publication');
const message_routes = require('./Routes/message');
const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', [
    user_routes,
    publication_routes,
    follow_routes,
    message_routes
]);

module.exports = app;