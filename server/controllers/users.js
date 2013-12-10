// Module Dependencies
var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../lib/utils');

// Export Functions

var login = function(req, res) {
    if (req.session.returnTo) {
        res.redirect(req.session.returnTo);
        delete req.session.returnTo;
        return;
    }
    req.user.update();
    res.redirect('/app');
}

//Login Action
exports.loginAction = function(req, res) {
    console.log(req.body);
    res.send(200, "OK");
    res.end();
}


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
    })
}


// Signup Page
exports.signup = function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/app');
        return;
    }

    res.render('user/signup', {
        title: 'Sign up'
    })
}

// Help Page
exports.help = function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/app');
        return;
    }

    res.render('user/help', {
        title: 'Help Page'
    })
}

// Forgot password Page
exports.forgotPassword = function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/app');
        return;
    }

    res.render('user/forgot-password', {
        title: 'Forgot Password'
    })
}


// Action for Forgot Password
exports.resetPassword = function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/app');
        return;
    }

    console.log(req.body);
    res.send(200, "OK");
    res.end();
}

// Action for Logout
exports.logout = function(req, res) {
    req.logout()
    res.redirect('/login')
}

// Action for Signup - Create User
exports.createUser = function(req, res) {

    // Validate inputs
    // Code needs refactor later
    // Check if email is in use

    User.findOne({
        email: req.body.inputEmail
    }, function(err, user) {
        if (err) {
            res.send(403, "error");
            res.end();
        }
        if (user) { // email in use
            res.send(403, "Email in use.");
            res.end();
        } else {
            // Email not in use, check password here
            if ((req.body.inputPassword != req.body.confirmPassword) || req.body.inputPassword.length < 6) {
                res.send(403, "Password do not match or less than minimum length. ");
                res.end();
            } else {

                // Email and password is valid
                // Extract info from req.body
                var userEmail = req.body.inputEmail;
                var userPassword = req.body.inputPassword;

                var userFirstName = req.body.inputEmail.slice(0, req.body.inputEmail.indexOf("."));
                userFirstName = userFirstName.substr(0, 1).toUpperCase() + userFirstName.substr(1);

                var userLastName = req.body.inputEmail.slice(req.body.inputEmail.indexOf(".") + 1, req.body.inputEmail.indexOf("@"));
                userLastName = userLastName.substr(0, 1).toUpperCase() + userLastName.substr(1);

                var userDetails = {
                    email: userEmail,
                    password: userPassword,
                    firstName: userFirstName,
                    lastName: userLastName
                }

                var user = new User(userDetails);

                user.provider = 'local';

                user.save(function(err) {
                    if (err) {
                        res.send(403, "Error saving details.");
                        res.end();
                    } else { // save successful, force login
                        return res.redirect('/app');
                    }
                });
            }
        }
    });

    // Extract info from req.body


    // var user = new User(req.body);

    // user.provider = 'local'
    // user.save(function(err) {
    //     if (err) {
    //         return res.render('user/signup', {
    //             errors: utils.errors(err.errors),
    //             user: user,
    //             title: 'Sign up'
    //         })
    //     }

    //     // manually login the user once successfully signed up
    //     req.logIn(user, function(err) {
    //         if (err) return next(err)
    //         return res.redirect('/app');
    //     })
    // })
    // res.send(200, "OK");
    // res.end();
}


// Server validation for Signup Inputs
var validate = function(input) {
    // Check DB if email is in use
    User.findOne({
        email: input.inputEmail
    }, function(err, user) {
        if (err) {
            console.log("Here at err:");
            return false;
        }
        if (user) {
            console.log("Here at user");
            return false;
        }
        return true;
    });
}


// Show Profile
exports.show = function(req, res) {
    var user = req.profile
    res.render('users/show', {
        title: user.name,
        user: user
    })
}

/**
 * Find user by id
 */

exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err)
            if (!user) return next(new Error('Failed to load User ' + id))
            req.profile = user
            next()
        })
}