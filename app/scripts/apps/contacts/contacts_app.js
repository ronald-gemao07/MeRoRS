define(["app"], function(MERORS){
  MERORS.module("ContactsApp", function(ContactsApp, MERORS, Backbone, Marionette, $, _){
    ContactsApp.startWithParent = false;

    ContactsApp.onStart = function(){
      console.log("starting ContactsApp");
    };

    ContactsApp.onStop = function(){
      console.log("stopping ContactsApp");
    };
  });

  MERORS.module("Routers.ContactsApp", function(ContactsAppRouter, MERORS, Backbone, Marionette, $, _){
    ContactsAppRouter.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "contacts(/filter/criterion::criterion)": "listContacts",
        "contacts/:id": "showContact",
        "contacts/:id/edit": "editContact"
      }
    });

    var executeAction = function(action, arg){
      MERORS.startSubApp("ContactsApp");
      action(arg);
      MERORS.execute("set:active:header", "contacts");
    };

    var API = {
      listContacts: function(criterion){
        require(["apps/contacts/list/list_controller"], function(ListController){
          executeAction(ListController.listContacts, criterion);
        });
      },

      showContact: function(id){
        require(["apps/contacts/show/show_controller"], function(ShowController){
          executeAction(ShowController.showContact, id);
        });
      },

      editContact: function(id){
        require(["apps/contacts/edit/edit_controller"], function(EditController){
          executeAction(EditController.editContact, id);
        });
      }
    };

    MERORS.on("contacts:list", function(){
      MERORS.navigate("contacts");
      API.listContacts();
    });

    MERORS.on("contacts:filter", function(criterion){
      if(criterion){
        MERORS.navigate("contacts/filter/criterion:" + criterion);
      }
      else{
        MERORS.navigate("contacts");
      }
    });

    MERORS.on("contact:show", function(id){
      MERORS.navigate("contacts/" + id);
      API.showContact(id);
    });

    MERORS.on("contact:edit", function(id){
      MERORS.navigate("contacts/" + id + "/edit");
      API.editContact(id);
    });

    MERORS.addInitializer(function(){
      new ContactsAppRouter.Router({
        controller: API
      });
    });
  });

  return MERORS.ContactsAppRouter;
});
