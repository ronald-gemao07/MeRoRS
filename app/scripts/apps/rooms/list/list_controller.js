define(["app", "apps/rooms/list/list_view"], function(MERORS, View){
  MERORS.module("RoomsApp.List", function(List, MERORS, Backbone, Marionette, $, _){
    List.Controller = {
      listRooms: function(criterion){
        require(["common/views", "entities/room"], function(CommonViews){
          var loadingView = new CommonViews.Loading();
          MERORS.mainRegion.show(loadingView);

          var fetchingRooms = MERORS.request("room:entities");

          var roomsListLayout = new View.Layout();
          var roomsListPanel = new View.Panel();

          require(["entities/common"], function(FilteredCollection){
            $.when(fetchingRooms).done(function(rooms){
              var filteredRooms = MERORS.Entities.FilteredCollection({
                collection: rooms,
                filterFunction: function(filterCriterion){
                  var criterion = filterCriterion.toLowerCase();
                  return function(room){
                    if(room.get('roomName').toLowerCase().indexOf(criterion) !== -1
                      || room.get('capacity').toLowerCase().indexOf(criterion) !== -1
                      || room.get('roomDescription').toLowerCase().indexOf(criterion) !== -1){
                        return room;
                    }
                  };
                }
              });

              if(criterion){
                filteredRooms.filter(criterion);
                roomsListPanel.once("show", function(){
                  roomsListPanel.triggerMethod("set:filter:criterion", criterion);
                });
              }

              var roomsListView = new View.Rooms({
                collection: filteredRooms
              });

              roomsListPanel.on("rooms:filter", function(filterCriterion){
                filteredRooms.filter(filterCriterion);
                MERORS.trigger("rooms:filter", filterCriterion);
              });

              roomsListLayout.on("show", function(){
                roomsListLayout.panelRegion.show(roomsListPanel);
                roomsListLayout.roomsRegion.show(roomsListView);
              });

              roomsListPanel.on("room:new", function(){
                require(["apps/rooms/new/new_view"], function(NewView){
                  var newRoom = MERORS.request("room:entity:new");

                  var view = new NewView.Room({
                    model: newRoom
                  });

                  view.on("form:submit", function(data){
                    var highestId = rooms.max(function(c){ return c.id; }).get("id");
                    data.id = highestId + 1;
                    if(newRoom.save(data)){
                      rooms.add(newRoom);
                      view.trigger("dialog:close");
                      var newRoomView = roomsListView.children.findByModel(newRoom);
                      // check whether the new room view is displayed (it could be
                      // invisible due to the current filter criterion)
                      if(newRoomView){
                        newRoomView.flash("success");
                      }
                    }
                    else{
                      view.triggerMethod("form:data:invalid", newRoom.validationError);
                    }
                  });

                  MERORS.dialogRegion.show(view);
                });
              });

              roomsListView.on("itemview:room:show", function(childView, model){
                MERORS.trigger("room:show", model.get("id"));
              });

              roomsListView.on("itemview:room:edit", function(childView, model){
                require(["apps/rooms/edit/edit_view"], function(EditView){
                  var view = new EditView.Room({
                    model: model
                  });

                  view.on("form:submit", function(data){
                    if(model.save(data)){
                      childView.render();
                      view.trigger("dialog:close");
                      childView.flash("success");
                    }
                    else{
                      view.triggerMethod("form:data:invalid", model.validationError);
                    }
                  });

                  MERORS.dialogRegion.show(view);
                });
              });

              roomsListView.on("itemview:room:delete", function(childView, model){
                model.destroy();
              });

              MERORS.mainRegion.show(roomsListLayout);
            });
          });
        });
      }
    }
  });

  return MERORS.RoomsApp.List.Controller;
});
