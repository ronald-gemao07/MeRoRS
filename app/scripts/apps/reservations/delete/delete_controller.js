'use strict';
define(['app', 'apps/reservations/delete/delete_view'], function(MERORS, View){
  MERORS.module('ReservationsApp.Delete', function(Delete, MERORS, Backbone, Marionette, $, _){
    Delete.Controller = {
      deleteReservation: function(id){
        require(['common/delete', 'entities/reservations'], function(CommonViews){
          var loadingView = new CommonViews.Loading({
            title: 'Artificial Loading Delay',
            message: 'Data loading is delayed to demonstrate using a loading view.'
          });
          MERORS.mainRegion.show(loadingView);

          var fetchingReservation = MERORS.request('reservations:entity', id);
          $.when(fetchingReservation).done(function(reservation){
            var view;
            if(reservation !== undefined){
              view = new View.Reservation({
                model: reservation,
                generateTitle: true
              });
            }
            else{
              view = new MERORS.RoomsApp.Show.MissingReservation();
            }

            MERORS.mainRegion.show(view);
          });
        });
      }
    };
  });
  return MERORS.ReservationsApp.Delete.Controller;
});