'use strict';

define(['app', 'apps/board/new/new_view', 'fullcalendar'], function(MERORS, View) {
    MERORS.module('BoardApp.NewView', function(NewView, MERORS, $, _) {
        NewView.Controller = {
            showAddView: function(calObj) {
                var view = new View.AddView(calObj);
                MERORS.dialogRegion.show(view);
                require(['entities/reservation', 'entities/profile'], function() {
                    var newReservation = MERORS.request('reservation:entity:new');
                    view.on('form:submit', function(data) {
                        
                        // Add the user profile on reservation
                        var userProfile = MERORS.request('profile:entity:first');

                        data.reservedBy = {
                            _id: userProfile.get('_id'),
                            firstName: userProfile.get('firstName'),
                            lastName: userProfile.get('lastName'),
                            email: userProfile.get('email')
                        };

                        newReservation.set(data);

                        newReservation.save({}, {
                            success: function(model, response) {
                                
                                
                                calObj.calendar.fullCalendar('renderEvent', {
                                    title: data.title,
                                    start: calObj.start,
                                    end: calObj.end,
                                    allDay: false,
                                    resourceId: calObj.resourceId,
                                    reservationId: response._id,
                                    reservedBy: data.reservedBy,
                                    description: data.description
                                }, true);

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