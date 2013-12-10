'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var ejsLocals = require('ejs-locals');
var http = require('http');
var mongoStore = require('connect-mongo') (express);
var flash = require('connect-flash');
var helpers = require('view-helpers');
var path = require('path');
var async = require('async');
var passport = require('passport');
var mongoose = require('mongoose');
var _ = require('underscore');

var pkg = require('../../package.json');

module.exports = function (app, config, passport, baucis) {

  app.configure(function(){

    // cookieParser should be above session
    app.use(express.cookieParser())

    // bodyParser should be above methodOverride
    app.use(express.bodyParser())
    app.use(express.methodOverride())


      app.set('port', 9000);

      app.engine('ejs', ejsLocals);

      app.set('views',__dirname + '/../views');
      app.set('view engine', 'ejs');

      // routes should be at the last
      app.use(app.router)

      // mount static
      app.use(express.static( __dirname + '/../../app') );
      app.use(express.static( __dirname +  '/../../.tmp') );

      // express/mongo session storage
      app.use(express.session({
        secret: 'm3RR05: 0ndwA1L!',
        store: new mongoStore({
          url: config.db,
          collection : 'sessions'
        })
      }))

      app.use(passport.initialize());
      app.use(passport.session());

      app.use('/api/v1', baucis({swagger: true}));

      // assume "not found" in the error msgs
      // is a 404. this is somewhat silly, but
      // valid, you can do whatever you like, set
      // properties, use instanceof etc.
      app.use(function(err, req, res, next){
        // treat as 404
        if (err.message
          && (~err.message.indexOf('not found')
          || (~err.message.indexOf('Cast to ObjectId failed')))) {
          return next()
        }

        // log it
        // send emails if you want
        console.error(err.stack)

        // error page
        res.status(500).render('500', { error: err.stack })
      })

      // assume 404 since no middleware responded
      app.use(function(req, res, next){
        res.status(404).render('404', {
          url: req.originalUrl,
          error: 'Not found'
        })
      });

  });


  // simple log
  app.use(function(req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
  });

}
