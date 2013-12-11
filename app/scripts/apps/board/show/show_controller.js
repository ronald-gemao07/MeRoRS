define(["app", "apps/board/show/show_view", "fullcalendar"], function(MERORS, View) {
    MERORS.module("BoardApp.Show", function(Show, MERORS, Backbone, Marionette, $, _, fullcalendar) {
        Show.Controller = {
            showBoard: function(config) {
                var view = new View.Message();
                MERORS.mainRegion.show(view);
                return this.createCalendar(config);
            },
            createCalendar: function(newConfig) {
                var calendarSelector = '#calendar';
                var date = new Date();
                var d = date.getDate();
                var m = date.getMonth();
                var y = date.getFullYear();

                var events = [];

                //loop each through all events fetched then modify its editable flag depending on the current time
                //if an event's end time is past the current time then it is considered done thus can no longer be edited
                events.forEach(function(event) {
                    var currentTime = $.fullCalendar.formatDate(new Date(), 'yyyy-MM-dd HH:mm');
                    var eventEndTime = $.fullCalendar.formatDate(event.end, 'yyyy-MM-dd HH:mm');
                    if (eventEndTime <= currentTime) {
                        event.editable = false;
                        event.title += " (Done)";
                        event.backgroundColor = "#C8DEAB";
                        event.borderColor = "#C8DEAB";
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
                    resources: [],
                    events: events
                };

                _.extend(config, newConfig);

                var calendar = $(calendarSelector).fullCalendar(config);

                $("#date-picker").datepicker({
                    dateFormat: 'yy-mm-dd',
                    onSelect: function(dateText, dateIns) {
                        var d = new Date(dateText);
                        $(calendarSelector).fullCalendar('gotoDate', d);
                    }
                });

                $(".fc-button-prev, .fc-button-next").click("click", function() {
                    var currentFullCalendarDate = $(calendarSelector).fullCalendar("getDate").getFullYear() + "-" + ($('#calendar').fullCalendar("getDate").getMonth() + 1) + "-" + $('#calendar').fullCalendar("getDate").getDate();
                    $("#date-picker").datepicker("setDate", currentFullCalendarDate);
                });

                return calendar;
            }
        }
    });

    return MERORS.BoardApp.Show.Controller;
});