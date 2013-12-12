define(["app"], function(MERORS) {
    MERORS.module("BoardApp", function(BoardApp, MERORS, Backbone, Marionette, $, _) {
        BoardApp.startWithParent = false;

        BoardApp.onStart = function() {
            console.log("starting BoardApp");
        };

        BoardApp.onStop = function() {
            console.log("stopping BoardApp");
        };
    });

    MERORS.module("Routers.BoardApp", function(BoardAppRouter, MERORS, Backbone, Marionette, $, _) {
        BoardAppRouter.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "board": "showBoard"
            }
        });

        

        var executeAction = function(action, arg) {
            MERORS.startSubApp("BoardApp");
            action(arg);
            MERORS.execute("set:active:header", "board");
        };

        var calendar;

        var API = {
            showBoard: function() {
                require(["apps/board/show/show_controller"], function(ShowController) {
                    // Pass the events on render
                    // hook up the calendar events
                    // Select or create reservation

                    var config = {
                        select: API.select,
                        eventResize: API.eventResize,
                        eventDrop: API.eventDrop,
                        eventClick: API.eventClick,
                        eventMouseover: API.eventMouseover,
                        eventMouseout: API.eventMouseout
                    }

                    executeAction(function() {}, null);

                    $.when(API.getRooms()).done(function(rooms) {
                        config.resources = rooms;
                        calendar = ShowController.showBoard(config);
                        console.log('show calendar')
                    });
                });
            },
            getRooms: function(config) {
                var dfd = $.Deferred();
                require(["common/views", "entities/room"], function(CommonViews) {
                    var loadingView = new CommonViews.Loading({
                        title: "Loading...",
                        message: "Loading events and rooms."
                    });
                    MERORS.mainRegion.show(loadingView);

                    var fetchingRooms = MERORS.request("room:entities");

                    $.when(fetchingRooms).done(function(rooms) {
                        console.log('got rooms')
                        var resources = [];
                        rooms.each(function(room) {
                            resources[resources.length] = {
                                id: room.get('_id'),
                                name: room.get('room')
                            }
                        });
                        dfd.resolve(resources);
                    });
                });

                return dfd.promise();
            },
            select: function(start, end, allDay, event, resourceId) {
                $('#title').val('');
                $('#description').val('');
                var currentTime = $.fullCalendar.formatDate(new Date(), 'yyyy-MM-dd HH:mm');
                var selectedTime = $.fullCalendar.formatDate(start, 'yyyy-MM-dd HH:mm');

                if (selectedTime > currentTime) {
                    $("#dialog").dialog({
                        resizable: true,
                        title: 'Create New Reservation',
                        width: "auto",
                        create: function(event, ui) {
                            $('#start-time').val(start);
                            $('#end-time').val(end);
                        },
                        buttons: {
                            CANCEL: function() {
                                $("#dialog").dialog("close");
                            },
                            "ADD": function(ev) {
                                var description = ($('#test-form').find('textarea[id=description]').val()).replace(/(<([^>]+)>)/ig, "");
                                var title = ($('#test-form').find('input[id=title]').val()).replace(/(<([^>]+)>)/ig, "");
                                var user = $('#test-form').find('input[id=user]').val();
                                var email = $('#test-form').find('input[id=email]').val();

                                if (title && description) {
                                    calendar.fullCalendar('renderEvent', {
                                        title: title,
                                        user: user,
                                        email: email,
                                        description: description,
                                        start: start,
                                        end: end,
                                        allDay: false,
                                        resourceId: resourceId
                                    }, true);
                                }
                                $("#dialog").dialog("close");
                            }
                        }
                    });
                } else {
                    $("<div>You can only add events later than the current time.</div>").dialog({
                        modal: true,
                        title: "Create New Reservation"
                    });
                }
                calendar.fullCalendar('unselect');
            },

            eventClick: function(calEvent, jsEvent, view) {
                var currentTime = $.fullCalendar.formatDate(new Date(), 'yyyy-MM-dd HH:mm');
                var selectedEventEndTime = $.fullCalendar.formatDate(calEvent.end, 'yyyy-MM-dd HH:mm');

                if (selectedEventEndTime > currentTime) {
                    $('#title').val(calEvent.title);
                    $('#description').val(calEvent.description);
                    $("#dialog").dialog({
                        resizable: true,
                        title: 'Edit Reservation',
                        width: "auto",
                        buttons: {
                            CANCEL: function() {
                                $("#dialog").dialog("close");
                            },

                            "Update": function() {
                                var description = $("#description").val();
                                var title = $("#title").val();
                                if(title=='' && description==''){
                                    calendar.fullCalendar('updateEvent', {
                                            title: calEvent.title,
                                            user : calEvent.user,
                                            email : calEvent.email,
                                            description: calEvent.description,
                                            start: calEvent.start,
                                            end: calEvent.end,
                                            allDay: false,
                                            resourceId: calEvent.resourceId
                                        },true 
                                    );
                                }
                                else{
                                    calEvent.title=title;
                                    calEvent.description=description;
                                    calendar.fullCalendar('updateEvent', {
                                            title: title,
                                            user : calEvent.user,
                                            email : calEvent.email,
                                            description: description,
                                            start: calEvent.start,
                                            end: calEvent.end,
                                            allDay: false,
                                            resourceId: calEvent.resourceId
                                        },true 
                                    );                        
                                }
                                $("#dialog").dialog("close");
                            },

                            "DELETE": function() {
                                calendar.fullCalendar('removeEvents', calEvent._id);
                                $("#dialog").dialog("close");
                            }
                        }
                    });
                } else {
                    $("<div>You can only edit events that have not yet been accomplished or is currently going on.</div>").dialog({
                        modal: true,
                        title: "Edit Reservation"
                    });
                }
                calendar.fullCalendar('unselect');
            },

            eventResize: function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view) {
                var currentTime = $.fullCalendar.formatDate(new Date(), 'yyyy-MM-dd HH:mm');
                var selectedEventNewEndTime = $.fullCalendar.formatDate(event.end, 'yyyy-MM-dd HH:mm');
                if (API.isCheckOverlap(event)) {
                    revertFunc();
                }
                if (currentTime > selectedEventNewEndTime) {
                    $("<div>You can not resize events with new end times in the past (End time earlier than current).</div>").dialog({
                        modal: true,
                        title: "Edit Reservation"
                    });
                    revertFunc();
                }
                ui.element.tooltip({hide:{effect:'fade'}});
            },

            eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc) {
                var currentTime = $.fullCalendar.formatDate(new Date(), 'yyyy-MM-dd HH:mm');
                var selectedEventNewEndTime = $.fullCalendar.formatDate(event.end, 'yyyy-MM-dd HH:mm');
                if (API.isCheckOverlap(event)) {
                    event.resourceId = event.oldResourceId;
                    revertFunc();
                }
                if (currentTime > selectedEventNewEndTime) {
                    $("<div>You can not resize events with new end times in the past (End time earlier than current).</div>").dialog({
                        modal: true,
                        title: "Edit Reservation"
                    });
                    revertFunc();
                }
            },

            eventMouseover : function( event, jsEvent, view ) {
                $(jsEvent.currentTarget).tooltip({
                    items : jsEvent.currentTarget,
                    content: function(){
                    return '<b>' + event.resource.name + '</b><br><b>Reserved By:</b> ' + event.user + '<br>' + '<b>' + event.title + '</b><br>&nbsp;&nbsp;&nbsp;&nbsp;<i>' + event.description + '</i><br><b>Start:</b> ' + event.start.toLocaleTimeString() + '<br><b>End:</b> ' + event.end.toLocaleTimeString();
                    }
                });
            },

            isCheckOverlap: function (event) {
                var start = new Date(event.start);
                var end = new Date(event.end);

                var events = calendar.fullCalendar('clientEvents');
                for (var i = 0; i < events.length; i++) {
                    var someEvent = events[i];

                    if (someEvent._id == event._id) {
                        continue;
                    }

                    var seStart = new Date(someEvent.start);
                    var seEnd = new Date(someEvent.end);

                    if ((event.resourceId == someEvent.resourceId) && (start < seEnd) && (seStart < end)) { // dates overlap
                        return true;
                    }
                }
            }
        };

        MERORS.on("board:show", function() {
            MERORS.navigate("board");
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