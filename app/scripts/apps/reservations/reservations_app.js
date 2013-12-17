'use strict';

define(['app'], function(MERORS) {
    MERORS.module('ReservationsApp', function(ReservationsApp) {
        ReservationsApp.startWithParent = false;
        ReservationsApp.onStart = function() {
        };

        ReservationsApp.onStop = function() {
        };
    });

    MERORS.module('Routers.ReservationsApp', function(ReservationsAppRouter, MERORS, Backbone, Marionette, $) {
        ReservationsAppRouter.Router = Marionette.AppRouter.extend({
            appRoutes: {
                'reservations(/filter/criterion::criterion)': 'listReservations',
                'reservations/:id': 'showReservation',
                'reservations/:id/edit': 'editReservation'
            }
        });

        var executeAction = function(action, arg) {
            $(document).attr('title', ' My Reservations - Global Zeal Meeting Room Reservation System');
            MERORS.startSubApp('ReservationsApp');
            action(arg);
            MERORS.execute('set:active:header', 'reservations');
        };


        var API = {
            listReservations: function(criterion) {
                require(['apps/reservations/list/list_controller'], function(ListController) {
                    executeAction(ListController.listReservations, criterion);
                });
            },
            showReservation: function(id) {
                require(['apps/reservations/show/show_controller'], function(ShowController) {
                    executeAction(ShowController.showRoom, id);
                });
            },
            editReservation: function(id) {
                require(['apps/reservations/edit/edit_controller'], function(EditController) {
                    executeAction(EditController.editRoom, id);
                });
            }
        };

        MERORS.on('reservations:list', function() {
            MERORS.navigate('reservations');
            API.listReservations();
        });

        MERORS.on('reservations:filter', function(criterion) {
            if (criterion) {
                MERORS.navigate('reservations/filter/criterion:' + criterion);
            } else {
                MERORS.navigate('reservations');
            }
        });

        MERORS.on('reservation:edit', function(id) {
            MERORS.navigate('reservations/' + id + '/edit');
            API.editRoom(id);
        });

        MERORS.addInitializer(function() {
            new ReservationsAppRouter.Router({
                controller: API
            });
        });
    });

    return MERORS.ReservationsAppRouter;
});