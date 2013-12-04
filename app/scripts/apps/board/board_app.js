define(["app", "marionette"], function(MERORS, Marionette){
  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      "board" : "showBoard"
    }
  });

  var API = {
    showBoard: function(){
      require(["apps/board/show/show_controller"], function(ShowController){
        MERORS.startSubApp(null);
        ShowController.showBoard();
        MERORS.execute("set:active:header", "board");

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        var calendar = $('#calendar').fullCalendar({
            theme: false,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'resourceDay,agendaWeek,'
            },
            slotMinutes: 15,
            defaultView: 'resourceDay',
            selectable: true,
            selectHelper: true,
            eventColor: '#8dc640',
            eventTextColor: '#111111',
            editable: true,
            slotEventOverlap: false,
            minTime: '8:00am',
            maxTime: '7:00pm',
            allDaySlot: false,
            resources: [
                {
                    name: "Room1",
                    id: "resource1"
                },
                {
                    name: "Room2",
                    id: "resource2"
                },
                {
                    name: "Room3",
                    id: "resource3"
                }
            ],
            events: [
                {
                    title: "All Day Event 1",
                    start: new Date(y, m, d - 1),
                    end: new Date(y, m, d + 1),
                    resourceId: "resource1"
                },
                {
                    title: "Short Event 1",
                    start: new Date(y, m, d, 8, 30),
                    end: new Date(y, m, d, 9, 30),
                    allDay: false,
                    resourceId: "resource1"
                },
                {
                    title: "Short Event 2",
                    start: new Date(y, m, d + 1, 14, 00),
                    end: new Date(y, m, d + 1, 15, 00),
                    allDay: false,
                    resourceId: "resource1"
                },
                {
                    title: "All Day Event 2",
                    start: new Date(y, m, d - 2),
                    end: new Date(y, m, d - 1),
                    resourceId: "resource2"
                },
                {
                    title: "Lunch",
                    start: new Date(y, m, d, 12, 0),
                    end: new Date(y, m, d, 14, 0),
                    allDay: false,
                    resourceId: "resource2"
                },
                {
                    title: "All Day Event 3",
                    start: new Date(y, m, d),
                    resourceId: "resource3"
                },
                {
                    title: "Click for Google",
                    start: new Date(y, m, d, 16, 0),
                    end: new Date(y, m, d, 18, 30),
                    allDay: false,
                    url: "http://google.com/",
                    resourceId: "resource3"
                }
            ],
            select: function(start, end, allDay, event, resourceId) {
               $("#dialog").dialog({
                    resizable: true,
                    title: 'Create New Reservation',
                    width: "auto",
                    buttons: {
                        CANCEL: function() {
                            $("#dialog").dialog("close");
                        },
                        "ADD": function(ev) {   
                            var form =$('#test-form');
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
                var id = calEvent.title;

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
        });

          $("#date-picker" ).datepicker({
              dateFormat: 'yy-mm-dd',
              onSelect: function(dateText,dateIns){
                var d = new Date(dateText);
                      $('#calendar').fullCalendar('gotoDate', d);
              }
          });
          
          $(".fc-button-prev, .fc-button-next").click("click", function () {
            var currentFullCalendarDate = $('#calendar').fullCalendar("getDate").getFullYear() + "-" + ($('#calendar').fullCalendar("getDate").getMonth() + 1) + "-" + $('#calendar').fullCalendar("getDate").getDate();
            $("#date-picker").datepicker("setDate", currentFullCalendarDate);
          });
      });
    }
  };

  MERORS.on("board:show", function(){
    MERORS.navigate("board");
    API.showBoard();
  });

  MERORS.addInitializer(function(){
    new Router({
      controller: API
    });
  });

  return Router;
});