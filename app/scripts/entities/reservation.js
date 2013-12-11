define(["app"], function(MERORS){
  MERORS.module("Entities", function(Entities, MERORS, Backbone, Marionette, $, _){
    Entities.Reservation = Backbone.Model.extend({
      idAttribute: '_id',

      urlRoot: "http://localhost:9000/api/v1/Reservations/",

      defaults: {
        _id:null,
        roomName: "",
        roomId:"",
        reservedBy: "",
        title: "",
        description: "",
        dateStart: "",
        dateEnd:"",
        timeStart: "",
        timeEnd:""
      },

      validate: function(attrs, options) {
        var errors = {}
/*        if (! attrs.title) {
          errors.title = "can't be blank";
        }
        if (! attrs.startDate) {
          errors.startDate = "can't be blank";
        }
        if( ! _.isEmpty(errors)){
          return errors;
        }*/
      }
    });

    //Entities.configureStorage(Entities.Reservation);

    Entities.ReservationCollection = Backbone.Collection.extend({
      url: "http://localhost:9000/api/v1/Reservations/",
      model: Entities.Reservation,
      comparator: "title"
    });

    //Entities.configureStorage(Entities.ReservationCollection);
/*
    var initializeReservations = function(){
      var reservations = new Entities.ReservationCollection([
        { reservationId: 1, title: "Team Kadasig Standup", description: "Team Kadasig standup meeting with Scrum Master" }
      ]);
      reservations.forEach(function(reservation){
        reservation.save();
      });
      return reservations.models;
    };*/

    var API = {
      getReservationEntities: function(){
        var reservations = new Entities.ReservationCollection();
        var defer = $.Deferred();
        reservations.fetch({
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        $.when(promise).done(function(reservations){
          if(reservations.length === 0){
            // if we don't have any reservations yet, create some for convenience
            //var models = initializeReservations();
            //reservations.reset(models);
          }
        });
        return promise;
      },

      getReservationEntity: function(reservationId){
        var reservation = new Entities.Reservation({id: reservationId});
        var defer = $.Deferred();
        setTimeout(function(){
          reservation.fetch({
            success: function(data){
              defer.resolve(data);
            },
            error: function(data){
              defer.resolve(undefined);
            }
          });
        }, 2000);
        return defer.promise();
      }
    };

    MERORS.reqres.setHandler("reservation:entities", function(){
      return API.getReservationEntities();
    });

    MERORS.reqres.setHandler("reservation:entity", function(id){
      return API.getReservationEntity(id);
    });

    MERORS.reqres.setHandler("reservation:entity:new", function(id){
      return new Entities.Reservation();
    });
  });

  return ;
});
