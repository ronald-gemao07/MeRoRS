'use strict';

define(['app', 'apps/reservations/edit/edit_view'], function(MERORS, View){
  MERORS.module('ReservationsApp.Edit', function(Edit, MERORS, Backbone, Marionette, $){
    Edit.Controller = {
      editReservation: function(id){
        require(['common/views', 'entities/reservation'], function(CommonViews){
          var loadingView = new CommonViews.Loading({
            title: 'Artificial Loading Delay',
            message: 'Data loading is delayed to demonstrate using a loading view.'
          });
          MERORS.mainRegion.show(loadingView);

          var fetchingReservation = MERORS.request('reservation:entity', id);
          $.when(fetchingReservation).done(function(reservation){
            var view;
            if(reservation !== undefined){
              view = new View.Reservation({
                model: reservation,
                generateTitle: true
              });

              view.on('form:submit', function(data){
                if(reservation.save(data)){
                  MERORS.trigger('reservation:show', reservation.get('id'));
                }
                else{
                  view.triggerMethod('form:data:invalid', reservation.validationError);
                }
              });
            }
            else{
              view = new MERORS.ReservationsApp.Show.MissingReservation();
            }

            MERORS.mainRegion.show(view);
          });
        });
      }
    };
  });

  return MERORS.ReservationsApp.Edit.Controller;
});
