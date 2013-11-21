define(["app", "apps/config/storage/localstorage"], function(MERORS){
  MERORS.module("Entities", function(Entities, MERORS, Backbone, Marionette, $, _){
    Entities.Room = Backbone.Model.extend({
      urlRoot: "rooms",

      defaults: {
        roomName: "",
        capacity: "",
        phoneNumber: ""
      },

      validate: function(attrs, options) {
        var errors = {}
        if (! attrs.roomName) {
          errors.roomName = "can't be blank";
        }
        if (! attrs.capacity) {
          errors.capacity = "can't be blank";
        }
        else{
          if (attrs.capacity.length < 2) {
            errors.capacity = "is too short";
          }
        }
        if( ! _.isEmpty(errors)){
          return errors;
        }
      }
    });

    Entities.configureStorage(Entities.Room);

    Entities.RoomCollection = Backbone.Collection.extend({
      url: "rooms",
      model: Entities.Room,
      comparator: "roomName"
    });

    Entities.configureStorage(Entities.RoomCollection);

    var initializeRooms = function(){
      var rooms = new Entities.RoomCollection([
        { id: 1, roomName: "Room A", capacity: "10", phoneNumber: "555-0184" },
        { id: 2, roomName: "Room B", capacity: "15", phoneNumber: "555-0163" },
        { id: 3, roomName: "Room C", capacity: "5", phoneNumber: "555-0129" }
      ]);
      rooms.forEach(function(room){
        room.save();
      });
      return rooms.models;
    };

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
            var models = initializeRooms();
            rooms.reset(models);
          }
        });
        return promise;
      },

      getRoomEntity: function(roomId){
        var room = new Entities.Room({id: roomId});
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
