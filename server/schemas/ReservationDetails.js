var mongoose = require( 'mongoose' ),
    Schema = mongoose.Schema;

var ReservationDetailsSchema = new Schema({
    _rid: { type: String, default: '' },
    date: { type: Date, default: '' },
    startTime: { type: String , default: '' },
    endTime: { type: String , default: '' }
});

ReservationDetailsSchema.pre('save', function (next) {
  next();
});

ReservationDetailsSchema.methods = {

	// define your methods here
}
module.exports = mongoose.model( 'ReservationDetails', ReservationDetailsSchema );