var mongoose = require('mongoose')
  , Room = mongoose.model('Room')
  , utils = require('../lib/utils');


exports.create = function(req, res) {
	console.log("POST!");
    var room = new Room(req.body)
    room.provider = 'local'
    room.save(function(err) {
        if (err) {
        	alert('error');
        }

        // manually login the user once successfully signed up
    })
}

exports.test = function(req, res) {
	console.log("GET!");
}





