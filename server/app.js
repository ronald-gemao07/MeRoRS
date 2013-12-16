'use strict';

var express = require('express');
var http = require('http');
var fs = require('fs');
var passport = require('passport');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env],
    mongoose = require('mongoose');

// Bootstrap db connection
mongoose.connect(process.env.MONGOHQ_URL || config.db);


// Bootstrap models
var models_path = __dirname + '/schemas';
fs.readdirSync(models_path).forEach(function(file) {
    if (~file.indexOf('.js')) {
        require(models_path + '/' + file);
        console.log(models_path + '/' + file);
    }
});

// bootstrap passport config
require('./config/passport')(passport, config);

var app = express();

// Baucis REST
var baucis = require('./api/rest_routes.js')(app);

console.log(baucis);

// express settings
require('./config/express')(app, config, passport, baucis);

// Bootstrap routes
require('./config/routes')(app, passport);


// start server
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express App started!');
});

// expose app
exports = module.exports = app;