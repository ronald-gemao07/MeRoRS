'use strict';

// Module Dependencies
var mongoose = require('mongoose');
var User = mongoose.model('User');
//var utils = require('../lib/utils');
var baucis = require('baucis');
var nodemailer = require('nodemailer');
var _ = require('underscore');
var mail = require('nodemailer').mail;

// Private functions

function _validateEmail(email) {
    var regExPattern = /[a-zA-Z]{1,20}\.[a-zA-Z]{1,20}@globalzeal\.net$/i;
    return regExPattern.test(email);
}

// userDetails = { firstName, lastName, email}

function _sendAdminNotification(userDetails, adminEmail, adminName) {
    // create reusable transport method (opens pool of SMTP connections)
    var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'Gmail',
        auth: {
            user: 'merors.min@gmail.com',
            pass: 'merors123'
        }
    });

    var htmlEmail = '<strong>Hi ' + adminName + ',</strong><br /><p>The following user registered recently: </p><br /><table border=\'1\' bordercolor=\'#FFCC00\' style=\'background-color:#FFFFCC\' width=\'100%\' cellpadding=\'3\' cellspacing=\'0\'><tr><td colspan=\'2\'><strong>New User Registered</strong></td></tr><tr><td><strong>Email:</strong></td><td>' + userDetails.email + '</td></tr><tr><td><strong>First Name:</strong></td><td>' + userDetails.firstName + '</td></tr><tr><td><strong>Last Name</strong></td><td>' + userDetails.lastName + '</td></tr></table><br /><br />Please activate said account if no problem exist.';

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'MeRoRS Admin<merors.min@gmail.com>', // sender address
        to: adminEmail, // list of receivers
        subject: 'New User Registered', // Subject line
        text: 'New user ' + userDetails.lastName + ', ' + userDetails.firstName + ' needs activation.', // plain text body
        html: htmlEmail // html body
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error) {
        if (error) {            mail({
                from: 'MeRoRS Admin<merors.min@gmail.com>', // sender address
                to: adminEmail, // list of receivers
                subject: 'New User Registered', // Subject line
                text: 'New user ' + userDetails.lastName + ', ' + userDetails.firstName + ' needs activation.', // plain text body
                html: 'New user ' + userDetails.lastName + ', ' + userDetails.firstName + ' needs activation.' // html body
            });
        } else {
            // admin notified successfully.
            // if you don't want to use this transport object anymore, uncomment following line
            smtpTransport.close(); // shut down the connection pool, no more messages
        }

    });

}


function sendStatusNotification(userDetails){
    // create reusable transport method (opens pool of SMTP connections)
    var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'Gmail',
        auth: {
            user: 'merors.min@gmail.com',
            pass: 'merors123'
        }
    });

    var htmlEmail = '<strong>Hi '+userDetails.firstName+',</strong><br><br>Congratulations! Your account has been successfully activated.';

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'MeRoRS Admin<merors.min@gmail.com>', // sender address
        to: userDetails.email, // list of receivers
        subject: 'MERORS Account Status Activitation', // Subject line
        text: 'Hi '+userDetails.firstName+'. Congratulations! Your account has been successfully activated.',
        html: htmlEmail // html body
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error) {
        if (error) {
            mail({
                from: 'MeRoRS Admin<merors.min@gmail.com>', // sender address
                to: userDetails.email, // list of receivers
                subject: 'Status Activitation', // Subject line
                text: 'Hi '+userDetails.firstName+'. Congratulations! Your account has been successfully activated.',
                html: 'Hi '+userDetails.firstName+'. Congratulations! Your account has been successfully activated.'
            });
        } else {
            smtpTransport.close(); // shut down the connection pool, no more messages
        }
    });
}


function _getActiveAdmins(userDetails, sendEmail) {
    var query = User.find({
        'status': 'Active',
        'group': 'Administrator'
    });

    // selecting the `firstName` and `email` fields
    query.select('firstName email');

    // execute the query
    query.exec(function(err, admins) {
        if (err) {
            console.log('Error during _getActiveAdmins');
            //return handleError(err);
        }

        _.each(admins, function(admin) {
            sendEmail(userDetails, admin.email, admin.firstName);
        });
    });
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
            return res.render('user/signup', {
                message: 'Server error: please contact site admin.',
                email: ''
            });
        }
        if (user) { // email in use
            return res.render('user/signup', {
                message: 'Email already in use.',
                email: ''
            });
        } else {
            // Email not in use, check password here
            if ((req.body.inputPassword !== req.body.confirmPassword) || req.body.inputPassword.length < 6) {
                return res.render('user/signup', {
                    message: 'Password do not match or less than 6 characters.',
                    email: req.body.inputEmail
                });
            } else {

                // Email and password is valid
                // Extract info from req.body
                var userEmail = req.body.inputEmail;

                if (!_validateEmail(userEmail)) {
                    return res.render('user/signup', {
                        message: 'Not a valid Global Zeal, Inc. email.',
                        email: req.body.inputEmail
                    });
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
                        return res.render('user/signup', {
                            message: 'Error saving details.',
                            email: ''
                        });
                    } else { // save successful

                        // Send email to Admin - default admin email at the moment: merors.min@gmail.com
                        _getActiveAdmins(userDetails, _sendAdminNotification);

                        // Account Created. Forward to login page.
                        return res.render('index', {
                            message: 'Account created. Please login to continue.'
                        });

                    } // end else
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

// REST Service

function getLoggedInUserProfile (req, res) {
    var userId = req.user._doc._id;

    User.findOne({
        _id: userId
    }).lean().exec(function ( err, results ) {
        if (err) {
            res.send(err);
        } else {
            delete results.hashed_password;
            delete results.salt;
            res.json(results);
        }
    });
}
function buildRESTController () {

    var restController = baucis.rest('User');


    // GET
    restController.get('/', function ( req, res, next ) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }

    });

    restController.get('/Profile', function ( req, res, next ) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            getLoggedInUserProfile(req, res, next);
        }

    });

    // Create user
    restController.post('/', function ( req, res, next ) {
        if (!req.isAuthenticated()) {
            res.send(401);
        }  else {
            next();
        }
    });

    // Update
    restController.put('/:id', function ( req, res, next ) {
        if (!req.isAuthenticated()) {
            res.send(401);
        }  else {
            if(req.body.status  === 'Active'){
                sendStatusNotification(req.body);
            }
            next();
        }
    });

    // Delete
    restController.delete('/', function ( req, res, next ) {
        if (!req.isAuthenticated()) {
            res.send(401);
        }  else {
            next();
        }
    });

    return restController;
}

function restController () {
    return buildRESTController();
}

exports.getRESTController = restController;
