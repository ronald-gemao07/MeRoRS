'use strict';

define(['app'], function(MERORS) {
    MERORS.module('Entities', function(Entities, MERORS, Backbone, Marionette, $) {
        Entities.Reservation = Backbone.Model.extend({
            idAttribute: '_id',

            urlRoot: 'http://localhost:9000/api/v1/Reservations/',

            defaults: {
                roomId: '',
                reservedBy: '',
                title: '',
                description: '',
                dateStart: '',
                dateEnd: '',
                timeStart: '',
                timeEnd: ''
            }

            /*validate: function(attrs, options) {
                var errors = {}
                       if (! attrs.title) {
                    errors.title = 'can't be blank';
                  }
                  if (! attrs.startDate) {
                    errors.startDate = 'can't be blank';
                  }
                  if( ! _.isEmpty(errors)){
                    return errors;
                  }
              
            } */
        });

        Entities.ReservationCollection = Backbone.Collection.extend({
            url: 'http://localhost:9000/api/v1/Reservations/',
            model: Entities.Reservation,
            comparator: 'title'
        });


        var API = {
            getReservationEntities: function() {
                var reservations = new Entities.ReservationCollection();
                var defer = $.Deferred();
                reservations.fetch({
                    success: function(data) {
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                $.when(promise).done();

                return promise;
            },

            getSpecificReservationEntities: function(obj) {
                var reservations = new Entities.ReservationCollection();
                reservations.url = 'http://localhost:9000/api/v1/Reservations/?dateStart='+obj.dateStart+'&dateEnd='+obj.dateEnd;
                var defer = $.Deferred();
                reservations.fetch({
                    success: function(data) {
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                $.when(promise).done();

                return promise;
            },

            getReservationEntity: function(reservationId) {
                var reservation = new Entities.Reservation({
                    _id: reservationId
                });
                var defer = $.Deferred();
                setTimeout(function() {
                    reservation.fetch({
                        success: function(data) {
                            defer.resolve(data);
                        },
                        error: function() {
                            defer.resolve(undefined);
                        }
                    });
                }, 500);
                return defer.promise();
            },

            getMyReservations: function () {
              var reservations = new Entities.ReservationCollection();
              reservations.url = 'http://localhost:9000/api/v1/Reservations/?getBy=user';
              var defer = $.Deferred();
              reservations.fetch({
                  success: function(data) {
                      defer.resolve(data);
                  }
              });
              var promise = defer.promise();
              $.when(promise).done();

              return promise;
            }
        };

        MERORS.reqres.setHandler('reservation:entities', function() {
            return API.getReservationEntities();
        });

        MERORS.reqres.setHandler('reservation:specificEntities', function(obj) {
            return API.getSpecificReservationEntities(obj);
        });

        MERORS.reqres.setHandler('reservation:entity', function(id) {
            return API.getReservationEntity(id);
        });

        MERORS.reqres.setHandler('reservation:entity:new', function() {
            return new Entities.Reservation();
        });

        MERORS.reqres.setHandler('reservation:myReservations', function() {
            return API.getMyReservations();
        });

    });
  return;
});

