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
			    ]		    
			  		    
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
