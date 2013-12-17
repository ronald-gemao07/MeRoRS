'use strict';

define(['app', 'apps/board/new/new_view', 'fullcalendar'], function(MERORS, View) {
    MERORS.module('BoardApp.NewView', function(NewView, MERORS) {
        NewView.Controller = {
            showAddView: function(calObj) {
                var view = new View.AddView(calObj);
                MERORS.dialogRegion.show(view);
                require(['entities/reservation'], function() {
                    var newReservation = MERORS.request('reservation:entity:new');
                    view.on('form:submit', function(data) {
                        newReservation.set(data);
                        newReservation.save({}, {
                            success: function(model, response) {
                                view.trigger("dialog:close");   
                            },
                            error: function(model, response) {
                                console.log('error! ' + response);
                            }
                        });

                    });
                });
            }
        };
    });

    return MERORS.BoardApp.NewView.Controller;
});