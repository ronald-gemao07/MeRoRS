'use strict';

define(['app', 'apps/board/common/views', 'fullcalendar'], function(MERORS, CommonViews) {
    MERORS.module('BoardApp.Edit.View', function(View) {
        View.AddView = CommonViews.Form.extend({
            title: 'Edit Reservation',
            onRender: function() {
                this.$('#room-id').val(this.options.resourceId);
                this.$('#title').val(this.options.title);
                this.$('#description').val(this.options.description);
                this.$('#start-date').val(this.options.dateStart);
                this.$('#end-date').val(this.options.dateEnd);
                this.$('#start-time').val(this.options.timeStart);
                this.$('#end-time').val(this.options.timeEnd);
                this.$('.js-edit').show();
                this.$('.js-delete').show();
            }
        });
    });
    return MERORS.BoardApp.Edit.View;
});