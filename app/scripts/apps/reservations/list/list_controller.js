'use strict';

define(['app', 'apps/reservations/list/list_view'], function(MERORS, View) {
    MERORS.module('ReservationsApp.List', function(List, MERORS, Backbone, Marionette, $) {
        List.Controller = {
            listReservations: function(criterion) {
                require(['common/views', 'entities/reservation' , 'entities/room'], function(CommonViews) {
                    var loadingView = new CommonViews.Loading();
                    MERORS.mainRegion.show(loadingView);

                    var fetchingReservations = MERORS.request('reservation:myReservations');
                    var roomsCollection = MERORS.request('room:entities:collection');


                    var reservationsListLayout = new View.Layout();
                    var reservationsListPanel = new View.Panel();

                    var getSplitTime = function(n) {
                        n = parseInt(n);
                        var stime = Math.floor(n / 100);
                        var etime = n - (stime * 100);
                        if (etime === 0){ etime = '00'; }
                        var h24=stime;                        
                        stime = stime%12;
                        if(stime===0){ 
                          stime=12; 
                        }
                        return stime.toString() + ':' + etime.toString() + (h24 < 12 ? ' am' : ' pm');
                    };

                    var getSplitDate = function(dateString) {
                        dateString = dateString.toString();
                        var year = dateString.slice(0, 4);
                        var month = dateString.slice(4, 6);
                        var day = dateString.slice(-2);

                        return month + '/' + day + '/' + year; 
                    };
                    

                    require(['entities/common'], function() {
                        $.when(fetchingReservations).done(function(reservations) {
                            for(var index in reservations.models){
                                reservations.models[index].attributes.timeStart = getSplitTime(reservations.models[index].attributes.timeStart);
                                reservations.models[index].attributes.timeEnd = getSplitTime(reservations.models[index].attributes.timeEnd);
                                reservations.models[index].attributes.dateStart = getSplitDate(reservations.models[index].attributes.dateStart);
                                reservations.models[index].attributes.dateEnd = getSplitDate(reservations.models[index].attributes.dateEnd);
                                
                                var room = roomsCollection.findWhere({ _id : reservations.models[index].attributes.roomId})         
                                reservations.models[index].attributes.roomName = room.attributes.room;               
                            }  
                        

                            var filteredReservations = MERORS.Entities.FilteredCollection({
                                collection: reservations,
                                filterFunction: function(filterCriterion) {
                                    var criterion = filterCriterion.toLowerCase();
                                    return function(reservation) {
                                        if (reservation.get('title').toLowerCase().indexOf(criterion) !== -1 || reservation.get('description').toLowerCase().indexOf(criterion) !== -1) {
                                            return reservation;
                                        }
                                    };
                                }
                            });

                            if (criterion) {
                                filteredReservations.filter(criterion);
                                reservationsListPanel.once('show', function() {
                                    reservationsListPanel.triggerMethod('set:filter:criterion', criterion);
                                });
                            }

                            var reservationsListView = new View.Reservations({
                                collection: filteredReservations
                            });

                            reservationsListPanel.on('reservations:filter', function(filterCriterion) {
                                filteredReservations.filter(filterCriterion);
                                MERORS.trigger('reservations:filter', filterCriterion);
                            });

                            reservationsListLayout.on('show', function() {
                                reservationsListLayout.panelRegion.show(reservationsListPanel);
                                reservationsListLayout.reservationsRegion.show(reservationsListView);
                            });

                            reservationsListPanel.on('reservation:new', function() {
                                require(['apps/reservations/new/new_view'], function(NewView) {
                                    var newReservation = MERORS.request('reservation:entity:new');

                                    var view = new NewView.Reservation({
                                        model: newReservation
                                    });

                                    view.on('form:submit', function(data) {
                                        var highestId = reservations.max(function(c) {
                                            return c.id;
                                        }).get('id');
                                        data.id = highestId + 1;
                                        if (newReservation.save(data)) {
                                            reservations.add(newReservation);
                                            view.trigger('dialog:close');
                                            var newReservationView = reservationsListView.children.findByModel(newReservation);
                                            if (newReservationView) {
                                                newReservationView.flash('success');
                                            }
                                        } else {
                                            view.triggerMethod('form:data:invalid', newReservation.validationError);
                                        }
                                    });

                                    MERORS.dialogRegion.show(view);
                                });
                            });

                            reservationsListView.on('itemview:reservation:show', function(childView, model) {
                                MERORS.trigger('reservation:show', model.get('id'));
                            });

                            reservationsListView.on('itemview:reservation:edit', function(childView, model) {
                                require(['apps/reservations/edit/edit_view'], function(EditView) {
                                    var view = new EditView.Reservation({
                                        model: model
                                    });

                                    view.on('form:submit', function(data) {
                                        view.trigger('dialog:close');

                                        if (model.save(data)) {
                                            childView.render();
                                            view.trigger('dialog:close');
                                            childView.flash('success');
                                        } else {
                                            view.triggerMethod('form:data:invalid', model.validationError);
                                        }
                                    });

                                    MERORS.dialogRegion.show(view);
                                });
                            });

                            reservationsListView.on('itemview:reservation:delete', function(childView, model) {
                                model.destroy();
                            });

                            MERORS.mainRegion.show(reservationsListLayout);
                        });
                    });
                });
            }
        };
    });

    return MERORS.ReservationsApp.List.Controller;
});