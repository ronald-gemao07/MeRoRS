define(["app", "apps/board/show/show_view", "fullcalendar"], function(MERORS, View){
  MERORS.module("BoardApp.Show", function(Show, MERORS, Backbone, Marionette, $, _, fullcalendar){
    Show.Controller = {
	    showBoard: function(config){
	      var view = new View.Message();
	      MERORS.mainRegion.show(view);
	      return this.createCalendar(config);
	    }, 
	    createCalendar: function (newConfig) {
	    	var calendarSelector = '#calendar';
			var date = new Date();
			var d = date.getDate();
			var m = date.getMonth();
			var y = date.getFullYear();

			var events = [
	                {
	                    title: "All Day Event 1",
	                    start: new Date(y, m, d - 1),
	                    end: new Date(y, m, d + 1),
	                    resourceId: "resource1"
	                },
	                {
	                    title: "Past Event 1",
	                    start: new Date(y, m, 8, 8, 30),
	                    end: new Date(y, m, 8, 9, 30),
	                    allDay: false,
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
	                    start: new Date(y, m, d, 15, 0),
	                    end: new Date(y, m, d, 16, 24),
	                    allDay: false,
	                    resourceId: "resource3"
	                },
	                {
	                    title: "Room1",
	                    start: new Date(y, m, d, 15, 0),
	                    end: new Date(y, m, d, 18, 0),
	                    allDay: false,
	                    resourceId: "resource1"
	                },
	                {
	                    title: "Room2",
	                    start: new Date(y, m, d, 15, 0),
	                    end: new Date(y, m, d, 18, 0),
	                    allDay: false,
	                    resourceId: "resource2"
	                },
	                {
	                    title: "Room3",
	                    start: new Date(y, m, d, 15, 0),
	                    end: new Date(y, m, d, 18, 0),
	                    allDay: false,
	                    resourceId: "resource3"
	                }
	            ];

	        //loop each through all events fetched then modify its editable flag depending on the current time
	        //if an event's end time is past the current time then it is considered done thus can no longer be edited
	        events.forEach(function (event){
	            var currentTime = $.fullCalendar.formatDate(new Date(),'yyyy-MM-dd HH:mm');
	            var eventEndTime = $.fullCalendar.formatDate(event.end,'yyyy-MM-dd HH:mm');
	            if(eventEndTime <= currentTime) {
	                event.editable = false;
	                event.title += " (Done)";
	                event.backgroundColor = "#C8DEAB";
	                event.borderColor = "#C8DEAB";
	            } else {
	                //event.eventColor = "#8dc640";
	            }
	        });

			var config = {
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
	            events: events,
	            /*editable: false,*/
	            select: function(start, end, allDay, event, resourceId) {

	                var currentTime = $.fullCalendar.formatDate(new Date(),'yyyy-MM-dd HH:mm');
	                var selectedTime = $.fullCalendar.formatDate(start,'yyyy-MM-dd HH:mm');

	                if(selectedTime > currentTime) {
	                    $("#dialog").dialog({
	                        resizable: true,
	                        title: 'Create New Reservation',
	                        width: "auto",
	                        buttons: {
	                            Add: function(ev) {   
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
	                            },
	                            Cancel: function() {
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
	                //use current time as base
	                var currentTime = $.fullCalendar.formatDate(new Date(),'yyyy-MM-dd HH:mm');
	                //use new event's end time based on the location clicked
	                var selectedEventEndTime = $.fullCalendar.formatDate(calEvent.end,'yyyy-MM-dd HH:mm');

	                //if the new event's end time is later than current time then it is valid
	                if(selectedEventEndTime > currentTime) {
	                    var id = calEvent.id;
	                    $("#dialog").dialog({
	                        resizable: true,
	                        title: 'Edit Reservation',
	                        width: "auto",
	                        buttons: {

	                            Update: function() {
	                                var form = $('#test-form');
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

	                            Delete: function() {
	                                calendar.fullCalendar('removeEvents', calEvent._id);
	                                $("#dialog").dialog("close");
	                            },

	                            Cancel: function() {
	                                $("#dialog").dialog("close");
	                            }
	                        }
	                    });
	                } else { //You can not make new reservations in the past, only in the future
	                    $("<div>You can only edit events that have not yet been accomplished or is currently going on.</div>").dialog({
	                        modal: true,
	                        title: "Edit Reservation"
	                    });
	                }
	                

	                calendar.fullCalendar('unselect');
	            },

	            eventResize: function(event, dayDelta, minuteDelta, revertFunc) {
	                //use current time as base
	                var currentTime = $.fullCalendar.formatDate(new Date(),'yyyy-MM-dd HH:mm');
	                //use the edited event's new end time as base
	                var selectedEventNewEndTime = $.fullCalendar.formatDate(event.end,'yyyy-MM-dd HH:mm');
	                //you can only set end times in the future for events
	                if(currentTime > selectedEventNewEndTime){
	                    $("<div>You can not resize events with new end times in the past (End time earlier than current).</div>").dialog({
	                        modal: true,
	                        title: "Edit Reservation"
	                    });
	                    //revert the event's original end time
	                    revertFunc();
	                }
	            },
	            eventDrop: function( event, dayDelta, minuteDelta, allDay, revertFunc) {
	                //use current time as base
	                var currentTime = $.fullCalendar.formatDate(new Date(),'yyyy-MM-dd HH:mm');
	                //use the edited event's new end time as base
	                var selectedEventNewEndTime = $.fullCalendar.formatDate(event.end,'yyyy-MM-dd HH:mm');
	                //you can only set end times in the future for events
	                if(currentTime > selectedEventNewEndTime){
	                    $("<div>You can not drag events back into the past (End time earlier than current).</div>").dialog({
	                        modal: true,
	                        title: "Drag Reservation"
	                    });
	                    //revert the event's original end time
	                    revertFunc();
	                }
	            }		    
			  		    
			};

			_.extend(config, newConfig);

			var calendar = $(calendarSelector).fullCalendar(config);

			$("#date-picker" ).datepicker({
			  dateFormat: 'yy-mm-dd',
			  onSelect: function(dateText,dateIns){
			    var d = new Date(dateText);
			          $(calendarSelector).fullCalendar('gotoDate', d);
			  }
			});

			$(".fc-button-prev, .fc-button-next").click("click", function () {
				var currentFullCalendarDate = $(calendarSelector).fullCalendar("getDate").getFullYear() + "-" + ($('#calendar').fullCalendar("getDate").getMonth() + 1) + "-" + $('#calendar').fullCalendar("getDate").getDate();
				$("#date-picker").datepicker("setDate", currentFullCalendarDate);
			});

	    	return calendar;
	    }
	}
  });

  return MERORS.BoardApp.Show.Controller;
});
