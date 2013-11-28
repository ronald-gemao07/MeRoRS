define(["app", "apps/users/common/views"], function(MERORS, CommonViews){
  MERORS.module("UsersApp.Edit.View", function(View, MERORS, Backbone, Marionette, $, _){
    View.User = CommonViews.Form.extend({
      initialize: function(){
        this.title = "Edit " + this.model.get("firstName") + " " + this.model.get("lastName");
      },

      onRender: function(){
        if(this.options.generateTitle){
          var $title = $("<h1>", { text: this.title });
          this.$el.prepend($title);

        }

        this.$(".js-submit").text("Update user");
      }
    });
  });

  return MERORS.UsersApp.Edit.View;
});
