'use strict';

define(['app', 'apps/board/show/show_view', 'fullcalendar'], function(MERORS, View) {
    MERORS.module('BoardApp.Show', function(Show, MERORS, Backbone, Marionette, $, _) {
        Show.Controller = {
            showBoard: function(config) {
                var view = new View.Message();
                MERORS.mainRegion.show(view);
                return this.createCalendar(config);
            },
            createCalendar: function(newConfig) {

                var calendarSelector = '#calendar';
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
                    events: []
                };
                _.extend(config, newConfig);

                var calendar = $(calendarSelector).fullCalendar(config);

                $('#date-picker').datepicker({
                    dateFormat: 'yy-mm-dd',
                    onSelect: function(dateText) {
                        var d = new Date(dateText);
                        $(calendarSelector).fullCalendar('gotoDate', d);
                    }
                });

                $(".fc-button-prev, .fc-button-next, .fc-button-today").click("click", function() {
                    var currentFullCalendarDate = $(calendarSelector).fullCalendar("getDate").getFullYear() + "-" + ($('#calendar').fullCalendar("getDate").getMonth() + 1) + "-" + $('#calendar').fullCalendar("getDate").getDate();
                    $("#date-picker").datepicker("setDate", currentFullCalendarDate);
                });

                return calendar;
            }
        };
    });

    return MERORS.BoardApp.Show.Controller;
});