define(["app", "apps/rooms/common/delete"], function(MERORS, CommonViews){
  MERORS.module("RoomsApp.Delete.View", function(View, MERORS, Backbone, Marionette, $, _){
    View.Room = CommonViews.Form.extend({
      initialize: function(){
        this.title = "Delete " + this.model.get("roomName");
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

  return MERORS.RoomsApp.Delete.View;
});