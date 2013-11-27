var mongoose = require( 'mongoose' ),
    Schema = mongoose.Schema;
var _ = require('underscore')

var RoomSchema = new Schema( {
      roomName: { type: String, default: '' },
	  roomCapacity: { type: Number, default: '' },
	  roomDescription: { type: String, default: '' }
});

RoomSchema.pre('save', function (next) {
	next();
});

/**
 * Methods
 */

RoomSchema.methods ={
  
}

module.exports = mongoose.model( 'Room', RoomSchema );