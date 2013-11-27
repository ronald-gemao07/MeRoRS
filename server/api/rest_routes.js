var mongoose = require( 'mongoose' ),
    Schema = mongoose.Schema;

var baucis = require('baucis');

module.exports = function (app) {
	baucis.rest('User');

	// Rooms

	// Reservations

	return baucis;
}