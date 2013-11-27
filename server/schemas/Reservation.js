var mongoose = require( 'mongoose' ),
    Schema = mongoose.Schema;

var ReservationSchema = new Schema({
    room: { type: String, default: '' },
    reservedBy: { type: String, default: '' },
    description: { type: String, default: '' },
    startDate: { type: Date, default: '' },
    endDate: { type: Date, default: '' },
    startTime: { type: String, default: '' },
    endTime: { type: String, default: '' },
    repeatType: { type: String, default: 'one time' },
    dayOfTheWeek: {type: Array , default:[] }
});

ReservationSchema.pre('save', function (next) {
  next();
});

module.exports = mongoose.model( 'Reservation', ReservationSchema );