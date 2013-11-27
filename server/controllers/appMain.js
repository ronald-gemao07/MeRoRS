var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    utils = require('../lib/utils'),
    _ = require('underscore');

exports.index = function (req, res) {

  var user = req.user;

  res.render('app/index', {
    title: 'Meeting Room Reservation System'
  });

}

