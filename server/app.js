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
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , mongoose = require('mongoose');

// Bootstrap db connection
mongoose.connect(process.env.MONGOHQ_URL || config.db);


// Bootstrap models
var models_path = __dirname + '/schemas'
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})

// bootstrap passport config
require('./config/passport')(passport, config)

var app = express()
// express settings
require('./config/express')(app, config, passport)

// Bootstrap routes
require('./config/routes')(app, passport)


// start server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express App started!');
});

// expose app
exports = module.exports = app;

// var express = require('express');
// var http = require('http');
// var path = require('path');
// var async = require('async');
// var hbs = require('express-hbs');
// var baucis = require('baucis');
// var passport = require('passport');

// var mongoose = require('mongoose');


// // start mongoose
// mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/merors');
// var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback () {

// 	/* test schema */
//     var testSchema = new mongoose.Schema({
//         test: String
//     });

//     var Test = mongoose.model( 'test', testSchema );

//     /* set Baucis */
//     baucis.rest({
//         singular: 'test'
//     });

// 	var app = express();

// 	app.configure(function(){
// 	    app.set('port', process.env.PORT || 9000);

// 	    app.set('view engine', 'handlebars');
// 	    app.set('views', __dirname + '../app/scripts/views');
// 	});

//     app.use('/api/v1', baucis());

// 	// simple log
// 	app.use(function(req, res, next){
// 	  console.log('%s %s', req.method, req.url);
// 	  next();
// 	});

// 	// mount static
// 	app.use(express.static( path.join( __dirname, '../app') ));
// 	app.use(express.static( path.join( __dirname, '../.tmp') ));


// 	// route index.html
// 	app.get('/', function(req, res){
// 	  res.sendfile( path.join( __dirname, '../app/index.html' ) );
// 	});

// 	// start server
// 	http.createServer(app).listen(app.get('port'), function(){
// 	    console.log('Express App started!');
// 	});
// });


