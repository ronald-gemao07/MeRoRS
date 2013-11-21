define(["app"], function(MERORS){
  MERORS.module("RoomsApp", function(RoomsApp, MERORS, Backbone, Marionette, $, _){
    RoomsApp.startWithParent = false;
    console.log('rooms app')
    RoomsApp.onStart = function(){
      console.log("starting RoomsApp");
    };

    RoomsApp.onStop = function(){
      console.log("stopping RoomsApp");
    };
  });

  MERORS.module("Routers.RoomsApp", function(RoomsAppRouter, MERORS, Backbone, Marionette, $, _){
    RoomsAppRouter.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "rooms(/filter/criterion::criterion)": "listRooms",
        "rooms/:id": "showRoom",
        "rooms/:id/edit": "editRoom"
      }
    });

    var executeAction = function(action, arg){
      MERORS.startSubApp("RoomsApp");
      action(arg);
      MERORS.execute("set:active:header", "rooms");
    };

    var API = {
      listRooms: function(criterion){
        require(["apps/rooms/list/list_controller"], function(ListController){
          console.log('rooms list')
          executeAction(ListController.listRooms, criterion);
        });
      },

      showRoom: function(id){
        require(["apps/rooms/show/show_controller"], function(ShowController){
          executeAction(ShowController.showRoom, id);
        });
      },

      editRoom: function(id){
        require(["apps/rooms/edit/edit_controller"], function(EditController){
          executeAction(EditController.editRoom, id);
        });
      }
    };

    MERORS.on("rooms:list", function(){
      MERORS.navigate("rooms");
      API.listRooms();
    });

    MERORS.on("rooms:filter", function(criterion){
      if(criterion){
        MERORS.navigate("rooms/filter/criterion:" + criterion);
      }
      else{
        MERORS.navigate("rooms");
      }
    });

    MERORS.on("room:show", function(id){
      MERORS.navigate("rooms/" + id);
      API.showRoom(id);
    });

    MERORS.on("room:edit", function(id){
      MERORS.navigate("rooms/" + id + "/edit");
      API.editRoom(id);
    });

    MERORS.addInitializer(function(){
      new RoomsAppRouter.Router({
        controller: API
      });
    });
  });

  return MERORS.RoomsAppRouter;
});
