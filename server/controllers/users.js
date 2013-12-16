'use strict';

// Module Dependencies
var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../lib/utils');

// Private functions
function _validateEmail(email) {
    var regExPattern = /[a-zA-Z]{1,20}\.[a-zA-Z]{1,20}@globalzeal\.net$/i;
    return regExPattern.test(email);
}

// Export Functions

var login = function(req, res) {
    if (req.session.returnTo) {
        res.redirect(req.session.returnTo);
        delete req.session.returnTo;
        return;
    }
    req.user.update();
    res.redirect('/app');
};

exports.authCallback = login;

/**
 * Show login form
 */

exports.login = function(req, res) {
    /*  if (req.isAuthenticated()) {
    res.redirect('/feeds');
    return;
  }
*/
    res.render('users/login', {
        title: 'Login',
        message: req.flash('error')
    });
};

// Signup Page
exports.signup = function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/app');
        return;
    }

    res.render('user/signup', {
        message: '',
        email: ''
    });
};

// Help Page
exports.help = function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/app');
        return;
    }

    res.render('user/help', {
        title: 'Help Page'
    });
};

// Forgot password Page
exports.forgotPassword = function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/app');
        return;
    }

    res.render('user/forgot-password', {
        title: 'Forgot Password'
    });
};


// Action for Forgot Password
exports.resetPassword = function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/app');
        return;
    }

    res.send(200, 'OK');
    res.end();
};

// Action for Logout
exports.logout = function(req, res) {
    req.logout();
    res.render('index', {
        message: 'You have been logged out successfully.'
    });
};

// Action for Signup - Create User
exports.createUser = function(req, res) {

    // Validate inputs
    // Code needs refactor later
    // Check if email is in use

    User.findOne({
        email: req.body.inputEmail
    }, function(err, user) {
        if (err) {
            return res.render('user/signup', { message: 'Server error: please contact site admin.', email: '' });
        }
        if (user) { // email in use
            return res.render('user/signup', { message: 'Email already in use.', email: '' } );
        } else {
            // Email not in use, check password here
            if ((req.body.inputPassword !== req.body.confirmPassword) || req.body.inputPassword.length < 6) {
                return res.render('user/signup', { message: 'Password do not match or less than 6 characters.', email: req.body.inputEmail } );
            } else {

                // Email and password is valid
                // Extract info from req.body
                var userEmail = req.body.inputEmail;

                if(!_validateEmail(userEmail)){
                    return res.render('user/signup', { message: 'Not a valid Global Zeal, Inc. email.', email: req.body.inputEmail });
                }

                var userPassword = req.body.inputPassword;

                var userFirstName = req.body.inputEmail.slice(0, req.body.inputEmail.indexOf('.'));
                userFirstName = userFirstName.substr(0, 1).toUpperCase() + userFirstName.substr(1);

                var userLastName = req.body.inputEmail.slice(req.body.inputEmail.indexOf('.') + 1, req.body.inputEmail.indexOf('@'));
                userLastName = userLastName.substr(0, 1).toUpperCase() + userLastName.substr(1);

                var userDetails = {
                    email: userEmail,
                    password: userPassword,
                    firstName: userFirstName,
                    lastName: userLastName
                };

                var userInfo = new User(userDetails);

                userInfo.provider = 'local';

                userInfo.save(function(err) {
                    if (err) {
                        return res.render('user/signup', { message: 'Error saving details.', email: '' });
                    } else { // save successful, force login
                        return res.render('index', { message: 'Account created. Please login to continue.' });
                    }
                });
            }
        }
    });
};


// Show Profile
exports.show = function(req, res) {
    var user = req.profile;
    res.render('users/show', {
        title: user.name,
        user: user
    });
};

// Find by user _id

exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new Error('Failed to load User ' + id));
            }
            req.profile = user;
            next();
        });
};