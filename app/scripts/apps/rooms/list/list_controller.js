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
                      || room.get('roomCapacity').toLowerCase().indexOf(criterion) !== -1
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
                    data.room=data.room.replace(/(<([^>]+)>)/ig,"");
                    data.description=data.description.replace(/(<([^>]+)>)/ig,"");
                    if(!data.room){
                      this.$("div.room-error-message").show();
                    }
                    else if(!data.capacity){
                      this.$("div.capacity-error-message").show();
                    }
                    else if(isNaN(data.capacity)){
                      this.$("div.capacity-error-message").show();
                    }
                    else if(!data.description){
                      this.$("div.description-error-message").show();
                    }
                    else{
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
                    }
                  });

                  MERORS.dialogRegion.show(view);
                });
              });

              roomsListView.on("itemview:room:show", function(childView, model){
                MERORS.trigger("room:show", model.get("_id"));
              });

              roomsListView.on("itemview:room:edit", function(childView, model){
                require(["apps/rooms/edit/edit_view"], function(EditView){
                  var view = new EditView.Room({
                    model: model
                  });

                  view.on("form:submit", function(data){
                    data.room=data.room.replace(/(<([^>]+)>)/ig,"");
                    data.description=data.description.replace(/(<([^>]+)>)/ig,"");
                    if(!data.room){
                      this.$("div.room-error-message").show();
                    }
                    else if(!data.capacity){
                      this.$("div.capacity-error-message").show();
                    }
                    else if(isNaN(data.capacity)){
                      this.$("div.capacity-error-message").show();
                    }
                    else if(!data.description){
                      this.$("div.description-error-message").show();
                    }
                    else{
                      if(model.save(data)){
                        childView.render();
                        view.trigger("dialog:close");
                        childView.flash("success");
                      }
                      else{
                        view.triggerMethod("form:data:invalid", model.validationError);
                      }
                    }
                  });

                  MERORS.dialogRegion.show(view);
                });
              });

              roomsListView.on("itemview:room:delete", function(childView, model){
                require(["apps/rooms/delete/delete_view"], function(DeleteView){
                  var view = new DeleteView.Room({
                    model: model
                  });

                  view.on("room : delete", function(data){
                    model.destroy({wait:false});
                    view.trigger("dialog:close");
                    childView.flash("success");
                  });

                  MERORS.dialogRegion.show(view);
                });
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
