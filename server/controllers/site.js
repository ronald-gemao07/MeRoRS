'use strict';
var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../lib/utils');

    exports.index = function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/app');
        } else {
            res.render('index', {
                title: 'Meeting Room Reservation System',
                message: ''
            });
        }
    };