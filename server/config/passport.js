'use strict';
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');
var auth = require('./middlewares/authorization');

module.exports = function(passport, config) {
    // require('./initializer')

    // serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, function(err, user) {
            done(err, user);
        });
    });

    // use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'inputEmail',
            passwordField: 'inputPassword',
            passReqToCallback: true
        },
        function(req, email, password, done) {
            passport;
            auth;
            req;
            arguments;
            User.findOne({
                email: email
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Invalid username or password.'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Invalid username or password.'
                    });
                }
                return done(null, user);
            });
        }
    ));
};