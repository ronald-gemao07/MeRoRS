define(["app", "apps/rooms/show/show_view"], function(MERORS, View){
  MERORS.module("RoomsApp.Show", function(Show, MERORS, Backbone, Marionette, $, _){
    Show.Controller = {
      showRoom: function(id){
        require(["common/views", "entities/room"], function(CommonViews){
          var loadingView = new CommonViews.Loading({
            title: "Artificial Loading Delay",
            message: "Data loading is delayed to demonstrate using a loading view."
          });
          MERORS.mainRegion.show(loadingView);

          var fetchingRoom = MERORS.request("room:entity", id);
          $.when(fetchingRoom).done(function(room){
            var roomView;
            if(room !== undefined){
              roomView = new View.Room({
                model: room
              });

              roomView.on("room:edit", function(room){
                MERORS.trigger("room:edit", room.get("id"));
              });
            }
            else{
              roomView = new View.MissingRoom();
            }

            MERORS.mainRegion.show(roomView);
          });
        });
      }
    }
  });

  return MERORS.RoomsApp.Show.Controller;
});
