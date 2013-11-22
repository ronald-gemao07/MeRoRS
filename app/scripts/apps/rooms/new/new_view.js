define(["app", "apps/rooms/common/views"], function(MERORS, CommonViews){
  MERORS.module("RoomsApp.New.View", function(View, MERORS, Backbone, Marionette, $, _){
    View.Room = CommonViews.Form.extend({
      title: "New Room",

      onRender: function(){
        this.$(".js-submit").text("Add room");
      }
    });
  });

  return MERORS.RoomsApp.New.View;
});
