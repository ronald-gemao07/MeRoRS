define(["app", "apps/contacts/common/views"], function(MERORS, CommonViews){
  MERORS.module("ContactsApp.New.View", function(View, MERORS, Backbone, Marionette, $, _){
    View.Contact = CommonViews.Form.extend({
      title: "New Contact",

      onRender: function(){
        this.$(".js-submit").text("Create contact");
      }
    });
  });

  return MERORS.ContactsApp.New.View;
});
