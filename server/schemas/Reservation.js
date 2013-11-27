var mongoose = require( 'mongoose' ),
    Schema = mongoose.Schema;
var _ = require('underscore')

var ReservationSchema = new Schema( );

ReservationSchema.pre('save', function (next) {
  next();
});

/**
 * Methods
 */

ReservationSchema.methods ={
  
}

module.exports = mongoose.model( 'Reservation', ReservationSchema );