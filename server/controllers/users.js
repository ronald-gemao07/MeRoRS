
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , utils = require('../lib/utils');

var login = function (req, res) {
  if (req.session.returnTo) {
    res.redirect(req.session.returnTo)
    delete req.session.returnTo
    return
  }
  req.user.update();
  res.redirect('/app')
}

//exports.signin = function (req, res) {

/**
 * Auth callback
 */

exports.loginAction = function(req, res){
    console.log(req.body);
    res.send(200, "OK");
    res.end();
}

//
// Show Sign Up Form
//

exports.authCallback = login

/**
 * Show login form
 */

exports.login = function (req, res) {
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

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/app');
    return;
  }

  res.render('user/signup', {
    title: 'Sign up'
  })
}

// Help Page

exports.help = function (req, res) {
  if (req.isAuthenticated()) {
      res.redirect('/app');
      return;
    }

  res.render('user/help', {
    title: 'Help Page'
  })
}

// Process forgot password
exports.forgotPassword = function(req, res){
  if (req.isAuthenticated()) {
        res.redirect('/app');
        return;
    }

    res.render('user/forgot-password', {
      title: 'Forgot Password'
    })
}

exports.resetPassword = function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/app');
        return;
    }

    console.log(req.body);
    res.send(200, "OK");
    res.end();
}

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout()
  res.redirect('/login')
}

/**
 * Session
 */

/**
 * Create user
 */

exports.createUser = function(req, res) {
    var user = new User(req.body)
    console.log(user);
    user.provider = 'local'
    user.save(function(err) {
        if (err) {
            return res.render('user/signup', {
                errors: utils.errors(err.errors),
                user: user,
                title: 'Sign up'
            })
        }

        // manually login the user once successfully signed up
        req.logIn(user, function(err) {
            if (err) return next(err)
            return res.redirect('/app');
        })
    })
    // res.send(200, "OK");
    // res.end();
}

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile
  res.render('users/show', {
    title: user.name,
    user: user
  })
}

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}