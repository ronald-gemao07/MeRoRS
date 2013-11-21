define(["app", "apps/contacts/common/views"], function(MERORS, CommonViews){
  MERORS.module("ContactsApp.Edit.View", function(View, MERORS, Backbone, Marionette, $, _){
    View.Contact = CommonViews.Form.extend({
      initialize: function(){
        this.title = "Edit " + this.model.get("firstName") + " " + this.model.get("lastName");
      },

      onRender: function(){
        if(this.options.generateTitle){
          var $title = $("<h1>", { text: this.title });
          this.$el.prepend($title);
        }

        this.$(".js-submit").text("Update contact");
      }
    });
  });

  return MERORS.ContactsApp.Edit.View;
});
