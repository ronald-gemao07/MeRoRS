define(["app", "apps/rooms/common/views"], function(MERORS, CommonViews){
  MERORS.module("RoomsApp.Edit.View", function(View, MERORS, Backbone, Marionette, $, _){
    View.Room = CommonViews.Form.extend({
      initialize: function(){
        this.title = "Edit " + this.model.get("roomName") + " " + this.model.get("lastName");
      },

      onRender: function(){
        if(this.options.generateTitle){
          var $title = $("<h1>", { text: this.title });
          this.$el.prepend($title);
        }

        this.$(".js-submit").text("Update room");
      }
    });
  });

  return MERORS.RoomsApp.Edit.View;
});
