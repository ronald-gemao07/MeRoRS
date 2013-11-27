define(["app", "apps/reservations/show/show_view"], function(MERORS, View){
  MERORS.module("ReservationsApp.Show", function(Show, MERORS, Backbone, Marionette, $, _){
    Show.Controller = {
      showReservation: function(id){
        require(["common/views", "entities/reservation"], function(CommonViews){
          var loadingView = new CommonViews.Loading({
            title: "Artificial Loading Delay",
            message: "Data loading is delayed to demonstrate using a loading view."
          });
          MERORS.mainRegion.show(loadingView);

          var fetchingReservation = MERORS.request("reservation:entity", id);
          $.when(fetchingReservation).done(function(reservation){
            var reservationView;
            if(reservation !== undefined){
              reservationView = new View.Reservation({
                model: reservation
              });

              reservationView.on("reservation:edit", function(reservation){
                MERORS.trigger("reservation:edit", reservation.get("id"));
              });
            }
            else{
              reservationView = new View.MissingReservation();
            }

            MERORS.mainRegion.show(reservationView);
          });
        });
      }
    }
  });

  return MERORS.ReservationsApp.Show.Controller;
});
