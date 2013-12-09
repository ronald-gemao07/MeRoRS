define(["app"], function(MERORS){
  MERORS.module("BoardApp", function(BoardApp, MERORS, Backbone, Marionette, $, _){
    BoardApp.startWithParent = false;

    BoardApp.onStart = function(){
      console.log("starting BoardApp");
    };

    BoardApp.onStop = function(){
      console.log("stopping BoardApp");
    };
  });

  MERORS.module("Routers.BoardApp", function(BoardAppRouter, MERORS, Backbone, Marionette, $, _){
    BoardAppRouter.Router = Marionette.AppRouter.extend({
        appRoutes: {
          "board" : "showBoard"
        }
      });

      var executeAction = function(action, arg){
          MERORS.startSubApp("BoardApp");
          action(arg);
          MERORS.execute("set:active:header", "board");
        };

        var calendar;

      var API = {
        showBoard: function(){
            require(["apps/board/show/show_controller"], function(ShowController){
                // Pass the events on render
                // hook up the calendar events
                // Select or create reservation

                var config = {
                    select: API.select,
                    eventClick: API.eventClick
                }

                executeAction(function  () {}, null);                      

                $.when(API.getRooms()).done(function (rooms) {
                    config.resources = rooms;
                    calendar = ShowController.showBoard(config);
                    console.log('show calendar')
                    console.log(rooms)
                });
            });           
        }, 
        getRooms: function (config) {       
            var dfd = $.Deferred(); 
            require(["common/views", "entities/room"], function(CommonViews){
                var loadingView = new CommonViews.Loading({
                    title: "Loading...",
                    message: "Loading events and rooms."
                  });
                  MERORS.mainRegion.show(loadingView);

                var fetchingRooms = MERORS.request("room:entities");

                $.when(fetchingRooms).done(function(rooms){
                    console.log('got rooms')
                    var resources = [];
                    rooms.each(function (room) {
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
            console.log('calendar select');
            console.log(arguments)
           $("#dialog").dialog({
                resizable: true,
                title: 'Create New Reservation',
                width: "auto",
                buttons: {
                    CANCEL: function() {
                        $("#dialog").dialog("close");
                    },
                    "ADD": function(ev) {   
                        var form = $('#test-form');
                        if(title=form.find('input[id=title]').val()){
                            calendar.fullCalendar('renderEvent', {
                                    title: title,
                                    start: start,
                                    end: end,
                                    allDay: allDay,
                                    resourceId: resourceId
                                },true 
                            );
                        }
                        $("#dialog").dialog("close");
                    }
                }
            });
            calendar.fullCalendar('unselect');
        }, 
        eventClick: function(calEvent, jsEvent, view) {
            var id = calEvent.id;
            $("#dialog").dialog({
                resizable: true,
                title: 'Edit Reservation',
                width: "auto",
                buttons: {
                    CANCEL: function() {
                        $("#dialog").dialog("close");
                    },

                    "Update": function() {
                        var form =$('#test-form');
                        console.log(calEvent.title);
                        calEvent.title = form.find('input[id=title]').val();
                        if(title=form.find('input[id=title]').val()){
                            calendar.fullCalendar('updateEvent', {
                                    title: calEvent.title,
                                    start: calEvent.start,
                                    end: calEvent.end,
                                    allDay: calEvent.allDay,
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
            calendar.fullCalendar('unselect');
        },

        eventResize: function(event, dayDelta, minuteDelta) {
                    console.log("@@ resize event " + event.title + ", start " + event.start + ", end " + event.end + ", resource " + event.resourceId);
                },
        eventDrop: function( event, dayDelta, minuteDelta, allDay) {
            console.log("@@ drag/drop event " + event.title + ", start " + event.start + ", end " + event.end + ", resource " + event.resourceId);
        }
      };

      MERORS.on("board:show", function(){
        MERORS.navigate("board");
        API.showBoard();
      });

      MERORS.addInitializer(function(){
        new BoardAppRouter.Router({
          controller: API
        });
      });

      return MERORS.BoardAppRouter;

    });
});