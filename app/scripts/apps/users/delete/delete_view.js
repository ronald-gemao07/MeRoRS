'use strict';
define(["app", "apps/users/common/delete"], function(MERORS, CommonViews){
  MERORS.module("UsersApp.Delete.View", function(View, MERORS, Backbone, Marionette, $, _){
    View.User = CommonViews.Form.extend({
      initialize: function(){
        this.title = "Delete " + this.model.get("firstName") + this.model.get("lastName");
      },

      onRender: function(){
        if(this.options.generateTitle){
          var $title = $("<h1>", { text: this.title });
          this.$el.prepend($title);
        } 
        this.$(".js-delete").text("Delete User");
      }
    });
  });

  return MERORS.UsersApp.Delete.View;
});