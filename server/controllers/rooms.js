'use strict';
var mongoose = require('mongoose'),
    Room = mongoose.model('Room'),
    utils = require('../lib/utils');

function checkRoomExists ( roomId, callback ) {
	Room.findOne({_id: roomId}, callback);
}

module.exports = {
	checkRoomExists: checkRoomExists
};