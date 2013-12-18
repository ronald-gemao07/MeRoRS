'use strict';

var baucis = require('baucis');
var reservationsController = require('../controllers/reservations');
var usersController = require('../controllers/users');

module.exports = function(app) {
    //User
    usersController.getRESTController();

    //Room
    baucis.rest('Room');

    //Reservation
    reservationsController.getRESTController();

    return baucis;
};