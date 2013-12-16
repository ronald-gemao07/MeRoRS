define(["app"], function(MERORS){
  MERORS.module("Entities", function(Entities, MERORS, Backbone, Marionette, $, _){
    Entities.Room = Backbone.Model.extend({

      idAttribute: '_id',

      urlRoot: "http://localhost:9000/api/v1/Rooms/",

      defaults: {
        room: "",
        capacity: "",
        description: "",
        active: ""
      },

      validate: function(attrs, options) {
        var errors = {}
        if (! attrs.room) {
          errors.room = "can't be blank";
        }
/*        if (! attrs.capacity) {
          errors.capacity = "can't be blank";
        }*/
/*        else{
          if (attrs.capacity.length < 2) {
            errors.capacity = "is too short";
          }
        }*/
        if( ! _.isEmpty(errors)){
          return errors;
        }
      }
    });

    //Entities.configureStorage(Entities.Room);

    Entities.RoomCollection = Backbone.Collection.extend({
      //var RoomCollection = Backbone.Collection.extend({
      url: "http://localhost:9000/api/v1/Rooms/",
      //model: RoomModel,
      model: Entities.Room,
      comparator: "room"
    });

    //Entities.configureStorage(Entities.RoomCollection);

/*    var initializeRooms = function(){
      var rooms = new Entities.RoomCollection([
        {roomName: "Room A", roomCapacity: "10", roomDescription: "for general meeting" },
        {roomName: "Room B", roomCapacity: "15", roomDescription: "for scrum masters only" },
        {roomName: "Room C", roomCapacity: "5", roomDescription: "for developers only" }
      ]);
      rooms.forEach(function(room){
        room.save();
      });
      return rooms.models;
    };*/

    var API = {
      getRoomEntities: function(){
        var rooms = new Entities.RoomCollection();
        var defer = $.Deferred();
        rooms.fetch({
          success: function(data){
            defer.resolve(data);
          }
        });
        var promise = defer.promise();
        $.when(promise).done(function(rooms){
          if(rooms.length === 0){
            // if we don't have any rooms yet, create some for convenience
            //var models = initializeRooms();
            //rooms.reset(models);
          }
        });
        return promise;
      },

      getRoomEntity: function(roomId){
        var room = new Entities.Room({_id: roomId});
        var defer = $.Deferred();
        setTimeout(function(){
          room.fetch({
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

    MERORS.reqres.setHandler("room:entities", function(){
      return API.getRoomEntities();
    });

    MERORS.reqres.setHandler("room:entity", function(id){
      return API.getRoomEntity(id);
    });

    MERORS.reqres.setHandler("room:entity:new", function(id){
      return new Entities.Room();
    });
  });

  return ;
});
