define(["app", "apps/reservations/common/views", "jquery.timepicker"], function(MERORS, CommonViews){
  MERORS.module("ReservationsApp.New.View", function(View, MERORS, Backbone, Marionette, $, _){
    View.Reservation = CommonViews.Form.extend({
      title: "New Reservation",

      onRender: function(){
  	    this.$(".start").timepicker();
  	    this.$(".end").timepicker();
        this.$(".js-submit").text("Add reservation");
      }
    });
  });

  return MERORS.ReservationsApp.New.View;
});
