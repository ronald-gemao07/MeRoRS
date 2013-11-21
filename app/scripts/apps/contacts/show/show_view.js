define(["app",
        "tpl!apps/contacts/show/templates/missing.tpl",
        "tpl!apps/contacts/show/templates/view.tpl"],
       function(MERORS, missingTpl, viewTpl){
  MERORS.module("ContactsApp.Show.View", function(View, MERORS, Backbone, Marionette, $, _){
    View.MissingContact = Marionette.ItemView.extend({
      template: missingTpl
    });

    View.Contact = Marionette.ItemView.extend({
      template: viewTpl,

      events: {
        "click a.js-edit": "editClicked"
      },

      editClicked: function(e){
        e.preventDefault();
        this.trigger("contact:edit", this.model);
      }
    });
  });

  return MERORS.ContactsApp.Show.View;
});
