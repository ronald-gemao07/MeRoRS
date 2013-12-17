'use strict';

// Module Dependencies
var async = require('async');

/**
 * Controllers
 */

var users = require('../controllers/users');
var rooms = require('../controllers/rooms');
var reservations = require('../controllers/reservations');
var site = require('../controllers/site');
var appMain = require('../controllers/appMain');
var auth = require('./middlewares/authorization');

    /**
     * Route middlewares
     */

var userAuth = [auth.user.isLoggedIn];

// Main Routes
module.exports = function(app, passport) {

    // user routes
    app.get('/login', users.login);

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.session.messages = [info.message];
                return res.render('index', { message: 'Invalid username or password.' });
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/app');
            });
        })(req, res, next);
    });


    app.get('/signup', users.signup);
    app.post('/signup', users.createUser);

    app.get('/help', users.help);

    app.get('/forgot-password', users.forgotPassword);
    app.post('/forgot-password', users.resetPassword);

    app.get('/logout', users.logout);

    // home route
    app.get('/', site.index);

    // main app
    app.get('/app', appMain.index);

};