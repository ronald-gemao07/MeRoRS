/*!
 * Module dependencies.
 */

var async = require('async')

/**
 * Controllers
 */

var users = require('../controllers/users'),
    rooms = require('../controllers/rooms'),
    reservations =require('../controllers/users'),

    site = require('../controllers/site'), 
    appMain = require('../controllers/appMain'), 
    reservations =require('../controllers/reservations'),

    auth = require('./middlewares/authorization')

/**
 * Route middlewares
 */

var userAuth = [auth.user.isLoggedIn]

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  // user routes
  app.get('/login', users.login);

  app.get('/signup', users.signup);
  app.post('/signup', users.create);

  app.get('/help', users.help);
  app.get('/forgot-password', users.forgotPassword);
  app.get('/logout', users.logout);

  // app.post('/users/session',
  //   passport.authenticate('local', {
  //     failureRedirect: '/login',
  //     failureFlash: 'Invalid email or password.',
  //     successRedirect: '/app'
  //   }), users.session)

  // home route
  app.get('/', site.index);


  // main app
  
  app.get('/app', appMain.index);
  //app.get('/api/v1/Rooms/', rooms.test);
  //app.post('/api/v1/Rooms/', rooms.create);

}
