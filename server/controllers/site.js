var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    utils = require('../lib/utils');

    exports.index = function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/app');
        } else {
            res.render('index', {
                title: 'Meeting Room Reservation System'
            });
        }
    };