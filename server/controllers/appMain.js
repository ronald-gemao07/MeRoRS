'use strict';
var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../lib/utils');
var _ = require('underscore');

exports.index = function(req, res) {
    if (!req.isAuthenticated()) {
        res.render('index', {
            message: 'Authentication required to access page.'
        });
        return;
    }

    var user = req.user;

    res.render('app/index', {
        title: 'Meeting Room Reservation System'
    });
};