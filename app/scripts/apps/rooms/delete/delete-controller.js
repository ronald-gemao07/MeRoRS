define(["app", "apps/rooms/delete/delete_view"], function(MERORS, View){
  MERORS.module("RoomsApp.Delete", function(Delete, MERORS, Backbone, Marionette, $, _){
    Edit.Controller = {
      deleteRoom: function(id){
        require(["common/delete", "entities/room"], function(CommonViews){
          var loadingView = new CommonViews.Loading({
            title: "Artificial Loading Delay",
            message: "Data loading is delayed to demonstrate using a loading view."
          });
          MERORS.mainRegion.show(loadingView);

          var fetchingRoom = MERORS.request("room:entity", id);
          $.when(fetchingRoom).done(function(room){
            var view;
            if(room !== undefined){
              view = new View.Room({
                model: room,
                generateTitle: true
              });
            }
            else{
              view = new MERORS.RoomsApp.Show.MissingRoom();
            }

            MERORS.mainRegion.show(view);
          });
        });
      }
    };
  });
  return MERORS.RoomsApp.Delete.Controller;
});