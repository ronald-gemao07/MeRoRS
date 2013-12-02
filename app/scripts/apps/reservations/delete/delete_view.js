define(["app", "apps/reservations/common/delete"], function(MERORS, CommonViews){
  MERORS.module("ReservationsApp.Delete.View", function(View, MERORS, Backbone, Marionette, $, _){
    View.Reservation = CommonViews.Form.extend({
      initialize: function(){
        this.title = "Delete " + this.model.get("title");
      },

      onRender: function(){
        if(this.options.generateTitle){
          var $title = $("<h1>", { text: this.title });
          this.$el.prepend($title);
        } 
        this.$(".js-delete").text("Delete Room");
      }
    });
  });

  return MERORS.ReservationsApp.Delete.View;
});