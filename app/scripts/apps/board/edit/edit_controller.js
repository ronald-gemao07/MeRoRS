'use strict';

define(['app', 'apps/board/edit/edit_view', 'fullcalendar'], function(MERORS, View) {
    MERORS.module('BoardApp.Edit', function(EditController, MERORS, Backbone, Marionette, $, _) {
        EditController.Controller = {
            editReservation: function(obj, calEvent) {
                var view = new View.AddView(obj);
                MERORS.dialogRegion.show(view);
                require(['entities/reservation'], function() {
                    var fetchingReservation = MERORS.request('reservation:entity', obj._id);

                    $.when(fetchingReservation).done(function(reservation) {


                        view.on('form:submit', function(data) {
                            reservation.set(data);
                            calEvent.title = data.title;
                            calEvent.description = data.description;
                            reservation.save({}, {
                                success: function() {
                                    obj.calendar.fullCalendar('updateEvent', calEvent, true);

                                    view.trigger("dialog:close");
                                },

                                error: function() {

                                }
                            });
                        });

                        view.on('form:delete', function() {

                            reservation.destroy({
                                success: function() {
                                    obj.calendar.fullCalendar('removeEvents', calEvent._id);

                                    view.trigger("dialog:close");
                                },

                                error: function(model, response) {
                                    console.log("error: " + response);
                                },
                                wait: false
                            });
                        });

                        //MERORS.mainRegion.show(view);
                    });

                });
            },

            resizeReservation: function(obj, calEvent) {
                var data = {
                    dateStart: obj.dateStart,
                    dateEnd: obj.dateEnd,
                    timeStart: obj.timeStart,
                    timeEnd: obj.timeEnd
                };
                
                require(['entities/reservation'], function() {
                    var fetchingReservation = MERORS.request('reservation:entity', obj._id);

                    $.when(fetchingReservation).done(function(reservation) {
                        reservation.set(data);
                        reservation.save({}, {
                            success: function() {
                                console.log("Heyy");
                                obj.calendar.fullCalendar('updateEvent', calEvent, true);        
                            },

                            error: function() {

                            }
                        });


                    });

                });
            },

            dropReservation: function(obj, calEvent) {
                var data = {
                    dateStart: obj.dateStart,
                    dateEnd: obj.dateEnd,
                    timeStart: obj.timeStart,
                    timeEnd: obj.timeEnd,                    
                    roomId: obj.resourceId,
                };
                
                require(['entities/reservation'], function() {
                    var fetchingReservation = MERORS.request('reservation:entity', obj._id);

                    $.when(fetchingReservation).done(function(reservation) {
                        reservation.set(data);
                        reservation.save({}, {
                            success: function() {
                                console.log("Heyy");
                                obj.calendar.fullCalendar('updateEvent', calEvent, true);        
                            },

                            error: function() {

                            }
                        });


                    });

                });
            }            
        };
    });

    return MERORS.BoardApp.Edit.Controller;
});