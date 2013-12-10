var mongoose = require( 'mongoose' ),
    Schema = mongoose.Schema;

var ReservationSchema= new Schema({
    roomName:{ type: String , default:'' },
    roomId: { type: String , default:'' },
    reservedBy: { type: String , default:'' },
    title: { type: String , default:'' },
    description: { type: String , default:'' },
    startTime: { type: Date , default:'' },
    endTime: { type: Date , default:'' }
    /*repetition: {
        type: { type: String , default:'' },
        endTime: { type: String , default:'' },
        endDate: { type: Date , default:'' },
        days: { type: Array , default:[] }
    }*/

});

ReservationSchema.pre('save', function (next) {
  next();
});

module.exports = mongoose.model( 'Reservation', ReservationSchema );