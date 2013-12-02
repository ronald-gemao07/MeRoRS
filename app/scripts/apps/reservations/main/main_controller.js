define(["app", "apps/reservations/main/main_view"], function(MERORS, View){
  MERORS.module("ReservationsApp.List", function(List, MERORS, Backbone, Marionette, $, _){
    List.Controller = {
      mainView: function (criterion) {
        console.log('main')
      }, 
      listReservations: function(criterion) {
        require(["common/views", "entities/reservation"], function(CommonViews){
          var loadingView = new CommonViews.Loading();
          MERORS.mainRegion.show(loadingView);

          var fetchingReservations = MERORS.request("reservation:entities");

          var reservationsListLayout = new View.Layout();
          var reservationsListPanel = new View.Panel();

          require(["entities/common"], function(FilteredCollection){
            $.when(fetchingReservations).done(function(reservations){
              var filteredReservations = MERORS.Entities.FilteredCollection({
                collection: reservations,
                filterFunction: function(filterCriterion){
                  var criterion = filterCriterion.toLowerCase();
                  return function(reservation){
                    if(reservation.get('title').toLowerCase().indexOf(criterion) !== -1
                      || reservation.get('description').toLowerCase().indexOf(criterion) !== -1){
                        return reservation;
                    }
                  };
                }
              });

              if(criterion){
                filteredReservations.filter(criterion);
                reservationsListPanel.once("show", function(){
                  reservationsListPanel.triggerMethod("set:filter:criterion", criterion);
                });
              }

              var reservationsListView = new View.Reservations({
                collection: filteredReservations
              });

              reservationsListPanel.on("reservations:filter", function(filterCriterion){
                filteredReservations.filter(filterCriterion);
                MERORS.trigger("reservations:filter", filterCriterion);
              });

              reservationsListLayout.on("show", function(){
                reservationsListLayout.panelRegion.show(reservationsListPanel);
                reservationsListLayout.reservationsRegion.show(reservationsListView);
              });

              reservationsListPanel.on("reservation:new", function(){
                require(["apps/reservations/new/new_view"], function(NewView){
                  var newReservation = MERORS.request("reservation:entity:new");

                  var view = new NewView.Reservation({
                    model: newReservation
                  });

                  view.on("form:submit", function(data){
                    console.log(data);
                    if(newReservation.save(data)){
                      console.log("here");
                      reservations.add(newReservation);
                      view.trigger("dialog:close");
                      var newReservationView = reservationsListView.children.findByModel(newReservation);
                      // check whether the new reservation view is displayed (it could be
                      // invisible due to the current filter criterion)
                      if(newReservationView){
                        newReservationView.flash("success");
                      }
                    }
                    else{
                      view.triggerMethod("form:data:invalid", newReservation.validationError);
                    }
                  });

                  MERORS.dialogRegion.show(view);
                });
              });

              reservationsListView.on("itemview:reservation:show", function(childView, model){
                MERORS.trigger("reservation:show", model.get("_id"));
                console.log('here');
              });

              reservationsListView.on("itemview:reservation:edit", function(childView, model){
                require(["apps/reservations/edit/edit_view"], function(EditView){
                  var view = new EditView.Reservation({
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

              reservationsListView.on("itemview:reservation:delete", function(childView, model){
                model.destroy();
              });

              MERORS.mainRegion.show(reservationsListLayout);
            });
          });
        });
      }
    }
  });

  return MERORS.ReservationsApp.List.Controller;
});
