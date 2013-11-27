var mongoose = require( 'mongoose' ),
    Schema = mongoose.Schema;

var RoomSchema = new Schema( {
  	room: { type: String, default: '' },
  	capacity: { type: Number, default: '' },
  	description: { type: String, default: '' },
  	active: { type: Number, default: 1 }
});

RoomSchema.pre('save', function (next) {
	next();
});

module.exports = mongoose.model( 'Room', RoomSchema );