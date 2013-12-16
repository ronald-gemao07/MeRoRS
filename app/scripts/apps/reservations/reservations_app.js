'use strict';
define(['app'], function(MERORS){
  MERORS.module('ReservationsApp', function(ReservationsApp, MERORS, Backbone, Marionette, $, _){
    ReservationsApp.startWithParent = false;
    console.log('reservations app');
    ReservationsApp.onStart = function(){
      console.log('starting ReservationsApp');
    };

    ReservationsApp.onStop = function(){
      console.log('stopping ReservationsApp');
    };
  });

  MERORS.module('Routers.ReservationsApp', function(ReservationsAppRouter, MERORS, Backbone, Marionette, $, _){
    ReservationsAppRouter.Router = Marionette.AppRouter.extend({
      appRoutes: {
        'reservations(/filter/criterion::criterion)': 'mainReservations',
        'reservations/:id': 'showReservation',
        'reservations/:id/edit': 'editReservation'
      }
    });

    var executeAction = function(action, arg){
      $(document).attr('title', ' My Reservations - Global Zeal Meeting Room Reservation System');
      MERORS.startSubApp('ReservationsApp');
      action(arg);
      MERORS.execute('set:active:header', 'reservations');
    };

    var API = {

      mainReservations: function (criterion) {
        require(['apps/reservations/main/main_controller'], function (MainController) {
          console.log('api');
          console.log(MainController);
          executeAction(MainController.listReservations, criterion);
        });
      },

      listReservations: function(criterion){
        require(['apps/reservations/list/list_controller'], function(ListController){
          console.log('reservations list');
          executeAction(ListController.listReservations, criterion);
        });
      },
      // Shows the description of a reservation
      showReservation: function (id) {
        require(['apps/reservations/show/show_controller'], function(ShowController){
          executeAction(ShowController.showRoom, id);
        });
      },
      // Edit a reservation
      editReservation: function (id) {
        require(['apps/reservations/edit/edit_controller'], function(EditController){
          executeAction(EditController.editRoom, id);
        });
      }
    };

    // Listeners for our routes
    MERORS.on('reservations:show', function(){
      MERORS.navigate('reservations');
      API.mainReservations();
    });

    MERORS.on('reservations:filter', function(criterion){
      if(criterion){
        MERORS.navigate('reservations/filter/criterion:' + criterion);
      }
      else{
        MERORS.navigate('reservations');
      }
    });

    MERORS.on('reservation:edit', function(id){
      MERORS.navigate('reservations/' + id + '/edit');
      API.editRoom(id);
    });

    MERORS.addInitializer(function(){
      new ReservationsAppRouter.Router({
        controller: API
      });
    });
  });

  return MERORS.ReservationsAppRouter;
});