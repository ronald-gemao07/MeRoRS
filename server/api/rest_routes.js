'use strict';
var mongoose = require( 'mongoose' ),
    Schema = mongoose.Schema;

var baucis = require('baucis');

module.exports = function (app) {
	//User
	baucis.rest('User');
	//Room
	baucis.rest('Room');
	//Reservation
	baucis.rest('Reservation');

	return baucis;
};