define(["app", "apps/reservations/common/views"], function(MERORS, CommonViews){
  MERORS.module("ReservationsApp.Edit.View", function(View, MERORS, Backbone, Marionette, $, _){
    View.Reservation = CommonViews.Form.extend({
      initialize: function(){
        this.title = "Edit " + this.model.get("title");
      },

      onRender: function(){
        if(this.options.generateTitle){
          var $title = $("<h1>", { text: this.title });
          this.$el.prepend($title);
        } 
        this.$(".js-submit").text("Update reservation");
      }
    });
  });

  return MERORS.ReservationsApp.Edit.View;
});
