'use strict';

define(['app'], function(MERORS) {
    MERORS.module('BoardApp', function(BoardApp) {
        BoardApp.startWithParent = false;

        BoardApp.onStart = function() {};

        BoardApp.onStop = function() {};
    });

    MERORS.module('Routers.BoardApp', function(BoardAppRouter, MERORS, Backbone, Marionette, $) {
        BoardAppRouter.Router = Marionette.AppRouter.extend({
            appRoutes: {
                'board': 'showBoard'
            }
        });

        var executeAction = function(action, arg) {
            MERORS.startSubApp('BoardApp');
            action(arg);
            MERORS.execute('set:active:header', 'board');
        };

        var calendar;

        var API = {
            showBoard: function() {
                require(['apps/board/show/show_controller'], function(ShowController) {
                    var config = {
                        select: API.select,
                        eventResize: API.eventResize,
                        eventDrop: API.eventDrop,
                        eventClick: API.eventClick,
                        eventMouseover: API.eventMouseover,
                        eventMouseout: API.eventMouseout,
                        viewDisplay: API.viewDisplay
                    };

                    executeAction(function() {}, null);

                    $.when(API.getRooms(), API.getReservations()).done(function(rooms, reservations) {
                        config.resources = rooms;
                        config.events = reservations;
                        calendar = ShowController.showBoard(config);
                    });
                });
            },

            getRooms: function() {
                var dfd = $.Deferred();

                require(['common/views', 'entities/room'], function(CommonViews) {
                    var loadingView = new CommonViews.Loading({
                        title: 'Loading...',
                        message: 'Loading events and rooms.'
                    });
                    MERORS.mainRegion.show(loadingView);

                    var fetchingRooms = MERORS.request('room:entities');

                    $.when(fetchingRooms).done(function(rooms) {
                        var resources = [];
                        rooms.each(function(room) {
                            resources[resources.length] = {
                                id: room.get('_id'),
                                name: room.get('room')
                            };
                        });
                        dfd.resolve(resources);
                    });
                });

                return dfd.promise();
            },

            getReservations: function() {
                var dfd = $.Deferred();

                require(['entities/reservation'], function() {
                    var fetchingReservations = MERORS.request('reservation:entities');

                    $.when(fetchingReservations).done(function(reservations) {
                        var events = [];
                        reservations.each(function(reservation) {
                            var startDate = API.mergeDateTime(reservation.get('dateStart'), reservation.get('timeStart'));
                            var endDate = API.mergeDateTime(reservation.get('dateEnd'), reservation.get('timeEnd'));
                            events[events.length] = {
                                reservationId: reservation.get('_id'),
                                reservedBy: reservation.get('reservedBy'),
                                title: reservation.get('title'),
                                description: reservation.get('description'),
                                resourceId: reservation.get('roomId'),
                                allDay: false,
                                roomName: reservation.get('roomName'),
                                start: startDate,
                                end: endDate
                            };
                        });
                        dfd.resolve(events);
                    });
                });

                return dfd.promise();
            },

            viewDisplay: function(view) {
                //view
            },

            select: function(start, end, allDay, event, resourceId) {
                var currentTime = $.fullCalendar.formatDate(new Date(), 'yyyy-MM-dd HH:mm');
                var selectedTime = $.fullCalendar.formatDate(start, 'yyyy-MM-dd HH:mm');
                var eventCheck = new Object();
                eventCheck.start = start;
                eventCheck.end = end;
                eventCheck.resourceId = resourceId;

                var obj = {
                    start: start,
                    end: end,
                    allDay: false,
                    event: event,
                    resourceId: resourceId,
                    dateStart: API.getDateType(start, 'year') + API.getDateType(start, 'month') + API.getDateType(start, 'day'),
                    dateEnd: API.getDateType(end, 'year') + API.getDateType(end, 'month') + API.getDateType(end, 'day'),
                    timeStart: API.getDateType(start, 'hour') + API.getDateType(start, 'minute'),
                    timeEnd: API.getDateType(end, 'hour') + API.getDateType(end, 'minute'),
                    calendar: calendar,
                    api: API
                };

                if (selectedTime > currentTime) {
                    require(['apps/board/new/new_view_controller'], function(NewViewController) {
                        NewViewController.showAddView(obj);
                    });
                } else {
                    $('<div>You can only add events later than the current time.</div>').dialog({
                        modal: true,
                        title: 'Create New Reservation'
                    });
                }

                calendar.fullCalendar('unselect');
            },

            eventClick: function(calEvent, jsEvent) {
                var currentTime = $.fullCalendar.formatDate(new Date(), 'yyyy-MM-dd HH:mm');
                var selectedTime = $.fullCalendar.formatDate(calEvent.start, 'yyyy-MM-dd HH:mm');

                if (selectedTime > currentTime) {
                    var obj = {
                        _id: calEvent._id,
                        start: calEvent.start,
                        end: calEvent.end,
                        allDay: false,
                        event: jsEvent,
                        resourceId: calEvent.end.resourceId,
                        resourceName: calEvent.end.resource.name,
                        title: calEvent.title,
                        dateStart: API.getDateType(calEvent.start, 'year') + API.getDateType(calEvent.start, 'month') + API.getDateType(calEvent.start, 'day'),
                        dateEnd: API.getDateType(calEvent.end, 'year') + API.getDateType(calEvent.end, 'month') + API.getDateType(calEvent.end, 'day'),
                        timeStart: API.getDateType(calEvent.start, 'hour') + API.getDateType(calEvent.start, 'minute'),
                        timeEnd: API.getDateType(calEvent.end, 'hour') + API.getDateType(calEvent.end, 'minute'),
                        calendar: calendar,
                        api: API
                    };
                    require(['apps/board/new/new_view_controller'], function(NewViewController) {
                        //NewViewController.showAddView(obj);
                    });
                } else {
                    $('<div>You can only add events later than the current time.</div>').dialog({
                        modal: true,
                        title: 'Create New Reservation'
                    });
                }

                calendar.fullCalendar('unselect');
            },

            eventResize: function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui) {
                var currentTime = $.fullCalendar.formatDate(new Date(), 'yyyy-MM-dd HH:mm');
                var selectedEventNewEndTime = $.fullCalendar.formatDate(event.end, 'yyyy-MM-dd HH:mm');

                if (API.isCheckOverlap(event)) {
                    revertFunc();
                }
                if (currentTime > selectedEventNewEndTime) {
                    $('<div>You can not resize events with new end times in the past (End time earlier than current).</div>').dialog({
                        modal: true,
                        title: 'Edit Reservation'
                    });
                    revertFunc();
                }
                ui.element.tooltip({
                    hide: {
                        effect: 'fade'
                    }
                });
            },

            eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc) {
                var currentTime = $.fullCalendar.formatDate(new Date(), 'yyyy-MM-dd HH:mm');
                var selectedEventNewEndTime = $.fullCalendar.formatDate(event.end, 'yyyy-MM-dd HH:mm');

                if (API.isCheckOverlap(event)) {
                    event.resourceId = event.oldResourceId;
                    revertFunc();
                }
                if (currentTime > selectedEventNewEndTime) {
                    $("<div>You can not drag events with new end times in the past (End time earlier than current).</div>").dialog({
                        modal: true,
                        title: 'Edit Reservation'
                    });
                    revertFunc();
                }
            },

            eventMouseover: function(event, jsEvent, view) {
                $(jsEvent.currentTarget).tooltip({
                    items: jsEvent.currentTarget,
                    content: function() {
                        return '<b>' + event.resource.name + '</b><br><b>Reserved By:</b> ' + event.user + '<br>' + '<b>' + event.title + '</b><br>&nbsp;&nbsp;&nbsp;&nbsp;<i>' + event.description + '</i><br><b>Start:</b> ' + event.start.toLocaleTimeString() + '<br><b>End:</b> ' + event.end.toLocaleTimeString();
                    }
                });
            },

            isCheckOverlap: function(event) {
                var start = new Date(event.start);
                var end = new Date(event.end);

                var events = calendar.fullCalendar('clientEvents');
                for (var i = 0; i < events.length; i++) {
                    var someEvent = events[i];

                    if (someEvent._id === event._id) {
                        continue;
                    }

                    var seStart = new Date(someEvent.start);
                    var seEnd = new Date(someEvent.end);

                    if ((event.resourceId === someEvent.resourceId) && (start < seEnd) && (seStart < end)) {
                        return true;
                    }
                }
            },

            getDateType: function(date, type) {
                date = new Date(date);
                var val = '';
                switch (type) {
                    case 'year':
                        val = date.getFullYear();
                        break;
                    case 'month':
                        var month = date.getMonth();
                        val = month < 10 ? '0' + month : month;
                        break;
                    case 'day':
                        var day = date.getDate();
                        val = day < 10 ? '0' + day : day;
                        break;
                    case 'hour':
                        val = date.getHours();
                        break;
                    case 'minute':
                        val = date.getMinutes();
                        if (val == '0') val = '00';
                        break;
                }
                return val.toString();
            },

            getSplitTime: function(n) {
                n = parseInt(n);
                var stime = Math.floor(n / 100);
                var etime = n - (stime * 100);
                if (etime === 0) etime = '00';

                return {
                    hour: stime.toString(),
                    minute: etime.toString()
                };
            },

            getSplitDate: function(dateString) {
                var year = dateString.slice(0, 4);
                var month = dateString.slice(4, 6);
                var day = dateString.slice(-2);

                return {
                    year: year,
                    month: month,
                    day: day
                };
            },

            mergeDateTime: function(date, time) {
                var yr = API.getSplitDate(date).year;
                var mt = API.getSplitDate(date).month;
                var dy = API.getSplitDate(date).day;
                var hr = API.getSplitTime(time).hour;
                var ms = API.getSplitTime(time).minute;

                return new Date(yr, mt, dy, hr, ms);
            }
        };

        MERORS.on('board:show', function() {
            MERORS.navigate('board');
            API.showBoard();
        });

        MERORS.addInitializer(function() {
            new BoardAppRouter.Router({
                controller: API
            });
        });

        return MERORS.BoardAppRouter;
    });
});