'use strict';

define(['app', 'apps/board/common/views', 'fullcalendar'], function(MERORS, CommonViews) {
    MERORS.module('BoardApp.New.View', function(View) {
        View.AddView = CommonViews.Form.extend({
            title: 'Add Reservation',
            onRender: function() {
                this.$('#room-id').val(this.options.resourceId);
                this.$('#start-date').val(this.options.dateStart);
                this.$('#end-date').val(this.options.dateEnd);
                this.$('#start-time').val(this.options.timeStart);
                this.$('#end-time').val(this.options.timeEnd);
                this.$('.js-submit').show();
            }
        });
    });
    return MERORS.BoardApp.New.View;
});