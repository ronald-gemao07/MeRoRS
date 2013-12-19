'use strict';

var mongoose = require('mongoose'),
  ReservationModel = mongoose.model('Reservation'),
  roomsController = require('./rooms'),
  async = require('async');

var baucis = require('baucis');

// Query daily reservations
function getReservations ( req, res, next ) {
	var params = req.query;
	var userId, roomId;

	switch(params.getBy) {
		case 'user':
			if (req.isAuthenticated()) {

				userId = req.user._doc._id;

			} else {
				userId = params.reservedBy;
			}
			
			if (!userId) {
				req.json({error: 'Invalid user id!'});
			} else {
				getReservationByUser(userId, req, res, next);
			}

			break;
		case 'room':
			roomId = params.roomId;

			getReservationByRoom(roomId, req, res, next);

			break;
		default:
			getAllRservationByDate(req, res, next);
	}

}

function getReservationByUser ( userId, req, res, next ) {
	ReservationModel.find({
        reservedBy: userId
    }).lean().exec(function ( err, results ) {
		if (err) {
			res.send(err);
		} else {
			res.json(results);
		}
    });
}

function getReservationByRoom (roomId, req, res, next) {
	var params = req.query;
	// Todo check roomId
	ReservationModel.find({
		roomId: roomId,
        dateStart: {
            $gte: params.dateStart,
            $lte: params.dateEnd
        },
        dateEnd: {
            $gte: params.dateStart,
            $lte: params.dateEnd
        }
    }).lean().exec(function ( err, results ) {
    	
		if (err) {
			res.send(err);
		} else {
			res.json(results);
		}
    });
}

function getAllRservationByDate (req, res, next) {
	var params = req.query;
	// Todo check roomId
	ReservationModel.find({
        dateStart: {
            $gte: params.dateStart,
            $lte: params.dateEnd
        },
        dateEnd: {
            $gte: params.dateStart,
            $lte: params.dateEnd
        }
    }).populate('reservedBy', 'firstName lastName email').lean().exec(function ( err, results ) {
		if (err) {
			res.send(err);
		} else {
			res.json(results);
		}
    });
}

function addOneTimeReservation ( req, res, next ) {
	var params = req.body;
	var userId = req.user._doc._id;

	if ((params.timeEnd - params.timeStart) < 15) {
		res.json({error: 'Time range error!'});
		return;
	}

	async.series({
		checkRoom: function (callback) {

			roomsController.checkRoomExists(params.roomId, function ( err, results ) {
				if (err) {
					callback(err);
				} else if (results) {
					callback(null, results);
				} else {
					callback(true);
				}
			});

		},
		checkConflicts: function (callback) {
			var find = {
		        roomId: params.roomId,
		        $or: [{
		            dateStart: {
		                $gte: params.dateStart,
		                $lte: params.dateEnd
		            },
		            $or: [{
		                timeStart: {
		                    $gte: params.timeStart,
		                    $lt: params.timeEnd
		                }
		            }, {
		                timeEnd: {
		                    $gt: params.timeStart,
		                    $lte: params.timeEnd
		                }
		            }]
		        }, {
		            dateEnd: {
		                $gte: params.dateEnd,
		                $lte: params.dateStart
		            },
		            $or: [{
		                timeStart: {
		                    $gte: params.timeStart,
		                    $lt: params.timeEnd
		                }
		            }, {
		                timeEnd: {
		                    $gt: params.timeStart,
		                    $lte: params.timeEnd
		                }
		            }]
		        }]
		    };
			ReservationModel.find(find, function ( err, results ) {

				callback(err, results);

		    });
		}
	}, function (err, results) {

		if (err) {
			if (!results.checkRoom) {
				res.json({error: 'Room does not exist!'});
			} else {
				next(err);
			}
		} else if (results.checkConflicts.length) {
			// Event conflict
			// Return the number of events
			res.json({results: results.checkConflicts.length});

        } else {
			// Add userId
			req.body.reservedBy = userId;

			next();
        }

	});

}

function addDailyReservation (req, res, next) {

}

function addWeeklyReservation ( req, res, next ) {
	
}

function updateOneTimeReservation ( req, res, next ) {
	var params = req.body;
	var userId = req.user._doc._id;
	var reservationId = req.params.id;

	if ((params.timeEnd - params.timeStart) < 15) {
		res.json({error: 'Time range error!'});
		return;
	}
	
	async.series({
		checkRoom: function (callback) {

			roomsController.checkRoomExists(params.roomId, function ( err, results ) {
				if (err) {
					callback(err);
				} else if (results) {
					callback(null, results);
				} else {
					callback(true);
				}
			});

		},
		getReservation: function (callback) {
			ReservationModel.find({
				_id: reservationId
			}, function ( err, results ) {

				callback(err, results);

		    });
		},
		checkConflicts: function (callback) {

			ReservationModel.find({
				_id: { $ne: reservationId },
		        roomId: params.roomId,
		        $or: [{
		            dateStart: {
		                $gte: params.dateStart,
		                $lte: params.dateEnd
		            },
		            $or: [{
		                timeStart: {
		                    $gte: params.timeStart,
		                    $lt: params.timeEnd
		                }
		            }, {
		                timeEnd: {
		                    $gt: params.timeStart,
		                    $lte: params.timeEnd
		                }
		            }]
		        }, {
		            dateEnd: {
		                $gte: params.dateEnd,
		                $lte: params.dateStart
		            },
		            $or: [{
		                timeStart: {
		                    $gte: params.timeStart,
		                    $lt: params.timeEnd
		                }
		            }, {
		                timeEnd: {
		                    $gt: params.timeStart,
		                    $lte: params.timeEnd
		                }
		            }]
		        }]
		    }, function ( err, results ) {

				callback(err, results);

		    });
		}
	}, function (err, results) {

		if (err) {
			if (!results.checkRoom) {
				res.json({error: 'Room does not exist!'});
			} else if (!results.getReservation) {
				res.json({error: 'Reservation does not exist!'});
			} else {
				next(err);
			}
		} else if (!results.getReservation.length) {
			// No reservation found
			res.json({error: 'No reservation found'});

        } else if (results.checkConflicts.length) {
			// Event conflict
			// Return the number of events
			res.json({results: results.checkConflicts.length});

        } else {
			// Add userId
			req.body.reservedBy = userId;

			next();
        }

	});
}

function updateDailyReservation (req, res, next) {

}

function updateWeeklyReservation ( req, res, next ) {
	
}

function buildRESTController () {
	var restController = baucis.rest('Reservation');


	// Query daily reservations
	restController.get('/', getReservations);

	// Create reservation
	restController.post('/', function ( req, res, next ) {
		
		if (!req.isAuthenticated()) {
			res.send(401);
		}

		switch (req.body.recurType) {
			case 'daily':
				addDailyReservation(req, res, next);
				break;
			case 'weekly':
				addWeeklyReservation(req, res, next);
				break;
			default:
				// One time
				addOneTimeReservation(req, res, next);
		}

	});

	// Update reservation
	restController.put('/:id', function ( req, res, next ) {
		
		if (!req.isAuthenticated()) {
			res.send(401);
		}

		switch (req.params.body) {
			case 'daily':
				updateDailyReservation(req, res, next);
				break;
			case 'weekly':
				updateWeeklyReservation(req, res, next);
				break;
			default:
				updateOneTimeReservation(req, res, next);
		}
	});

	// Delete reservation
	restController.delete('/', function ( req, res, next ) {

		// Todo: make truthy on live
		if (!req.isAuthenticated()) {
			res.send(401);
		}

		next();

	});

	return restController;
}

function restController () {
	return buildRESTController();
}

module.exports = {
	getRESTController: restController
};

/* add your methods here...please refer to users.js */