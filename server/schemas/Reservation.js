'use strict';
var mongoose = require( 'mongoose' ),
    Schema = mongoose.Schema;

var ReservationSchema = new Schema({
    roomId: { type: Schema.Types.ObjectId, required: true, ref: 'Room' },
    reservedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String , default:'', required: true },
    description: { type: String , default:'' },
    dateStart: { type: Number, required: true },
    dateEnd: { type: Number, required: true },
    timeEnd: { type: Number, required: true },
    timeStart: { type: Number, required: true }
});

var Reservation = mongoose.model( 'Reservation', ReservationSchema );

module.exports = Reservation;
