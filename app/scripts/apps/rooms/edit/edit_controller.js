'use strict';

define(['app', 'apps/rooms/edit/edit_view'], function(MERORS, View) {
    MERORS.module('RoomsApp.Edit', function(Edit, MERORS, Backbone, Marionette, $, _) {
        Edit.Controller = {
            editRoom: function(id) {
                require(['common/views', 'entities/room'], function(CommonViews) {
                    var loadingView = new CommonViews.Loading({
                        title: 'Artificial Loading Delay',
                        message: 'Data loading is delayed to demonstrate using a loading view.'
                    });
                    MERORS.mainRegion.show(loadingView);

                    var fetchingRoom = MERORS.request('room:entity', id);
                    $.when(fetchingRoom).done(function(room) {
                        var view;
                        if (room !== undefined) {
                            view = new View.Room({
                                model: room,
                                generateTitle: true
                            });

                            view.on('form:submit', function(data) {
                                if (room.save(data)) {
                                    MERORS.trigger('room:show', room.get('id'));
                                } else {
                                    view.triggerMethod('form:data:invalid', room.validationError);
                                }
                            });
                        } else {
                            view = new MERORS.RoomsApp.Show.MissingRoom();
                        }

                        MERORS.mainRegion.show(view);
                    });
                });
            }
        };
    });

    return MERORS.RoomsApp.Edit.Controller;
});