'use strict';
var mongoose = require( 'mongoose' ),
    Schema = mongoose.Schema;

var ReservationSchema= new Schema({
    roomName:{ type: String , default:'' },
    roomId: { type: String , default:'' },
    reservedBy: { type: String , default:'' },
    title: { type: String , default:'' },
    description: { type: String , default:'' },
    dateStart: { type: String , default:'' },
    dateEnd: { type: String , default:'' },
    timeEnd: { type: String , default:'' },
    timeStart: { type: String , default:'' }
});

ReservationSchema.pre('save', function (next) {
  next();
});

module.exports = mongoose.model( 'Reservation', ReservationSchema );