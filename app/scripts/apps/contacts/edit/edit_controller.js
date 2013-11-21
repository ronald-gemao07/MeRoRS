define(["app", "apps/contacts/edit/edit_view"], function(MERORS, View){
  MERORS.module("ContactsApp.Edit", function(Edit, MERORS, Backbone, Marionette, $, _){
    Edit.Controller = {
      editContact: function(id){
        require(["common/views", "entities/contact"], function(CommonViews){
          var loadingView = new CommonViews.Loading({
            title: "Artificial Loading Delay",
            message: "Data loading is delayed to demonstrate using a loading view."
          });
          MERORS.mainRegion.show(loadingView);

          var fetchingContact = MERORS.request("contact:entity", id);
          $.when(fetchingContact).done(function(contact){
            var view;
            if(contact !== undefined){
              view = new View.Contact({
                model: contact,
                generateTitle: true
              });

              view.on("form:submit", function(data){
                if(contact.save(data)){
                  MERORS.trigger("contact:show", contact.get('id'));
                }
                else{
                  view.triggerMethod("form:data:invalid", contact.validationError);
                }
              });
            }
            else{
              view = new MERORS.ContactsApp.Show.MissingContact();
            }

            MERORS.mainRegion.show(view);
          });
        });
      }
    };
  });

  return MERORS.ContactsApp.Edit.Controller;
});
