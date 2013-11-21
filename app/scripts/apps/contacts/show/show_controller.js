define(["app", "apps/contacts/show/show_view"], function(MERORS, View){
  MERORS.module("ContactsApp.Show", function(Show, MERORS, Backbone, Marionette, $, _){
    Show.Controller = {
      showContact: function(id){
        require(["common/views", "entities/contact"], function(CommonViews){
          var loadingView = new CommonViews.Loading({
            title: "Artificial Loading Delay",
            message: "Data loading is delayed to demonstrate using a loading view."
          });
          MERORS.mainRegion.show(loadingView);

          var fetchingContact = MERORS.request("contact:entity", id);
          $.when(fetchingContact).done(function(contact){
            var contactView;
            if(contact !== undefined){
              contactView = new View.Contact({
                model: contact
              });

              contactView.on("contact:edit", function(contact){
                MERORS.trigger("contact:edit", contact.get("id"));
              });
            }
            else{
              contactView = new View.MissingContact();
            }

            MERORS.mainRegion.show(contactView);
          });
        });
      }
    }
  });

  return MERORS.ContactsApp.Show.Controller;
});
