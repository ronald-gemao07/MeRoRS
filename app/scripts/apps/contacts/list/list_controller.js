define(["app", "apps/contacts/list/list_view"], function(MERORS, View){
  MERORS.module("ContactsApp.List", function(List, MERORS, Backbone, Marionette, $, _){
    List.Controller = {
      listContacts: function(criterion){
        require(["common/views", "entities/contact"], function(CommonViews){
          var loadingView = new CommonViews.Loading();
          MERORS.mainRegion.show(loadingView);

          var fetchingContacts = MERORS.request("contact:entities");

          var contactsListLayout = new View.Layout();
          var contactsListPanel = new View.Panel();

          require(["entities/common"], function(FilteredCollection){
            $.when(fetchingContacts).done(function(contacts){
              var filteredContacts = MERORS.Entities.FilteredCollection({
                collection: contacts,
                filterFunction: function(filterCriterion){
                  var criterion = filterCriterion.toLowerCase();
                  return function(contact){
                    if(contact.get('firstName').toLowerCase().indexOf(criterion) !== -1
                      || contact.get('lastName').toLowerCase().indexOf(criterion) !== -1
                      || contact.get('phoneNumber').toLowerCase().indexOf(criterion) !== -1){
                        return contact;
                    }
                  };
                }
              });

              if(criterion){
                filteredContacts.filter(criterion);
                contactsListPanel.once("show", function(){
                  contactsListPanel.triggerMethod("set:filter:criterion", criterion);
                });
              }

              var contactsListView = new View.Contacts({
                collection: filteredContacts
              });

              contactsListPanel.on("contacts:filter", function(filterCriterion){
                filteredContacts.filter(filterCriterion);
                MERORS.trigger("contacts:filter", filterCriterion);
              });

              contactsListLayout.on("show", function(){
                contactsListLayout.panelRegion.show(contactsListPanel);
                contactsListLayout.contactsRegion.show(contactsListView);
              });

              contactsListPanel.on("contact:new", function(){
                require(["apps/contacts/new/new_view"], function(NewView){
                  var newContact = MERORS.request("contact:entity:new");

                  var view = new NewView.Contact({
                    model: newContact
                  });

                  view.on("form:submit", function(data){
                    var highestId = contacts.max(function(c){ return c.id; }).get("id");
                    data.id = highestId + 1;
                    if(newContact.save(data)){
                      contacts.add(newContact);
                      view.trigger("dialog:close");
                      var newContactView = contactsListView.children.findByModel(newContact);
                      // check whether the new contact view is displayed (it could be
                      // invisible due to the current filter criterion)
                      if(newContactView){
                        newContactView.flash("success");
                      }
                    }
                    else{
                      view.triggerMethod("form:data:invalid", newContact.validationError);
                    }
                  });

                  MERORS.dialogRegion.show(view);
                });
              });

              contactsListView.on("itemview:contact:show", function(childView, model){
                MERORS.trigger("contact:show", model.get("id"));
              });

              contactsListView.on("itemview:contact:edit", function(childView, model){
                require(["apps/contacts/edit/edit_view"], function(EditView){
                  var view = new EditView.Contact({
                    model: model
                  });

                  view.on("form:submit", function(data){
                    if(model.save(data)){
                      childView.render();
                      view.trigger("dialog:close");
                      childView.flash("success");
                    }
                    else{
                      view.triggerMethod("form:data:invalid", model.validationError);
                    }
                  });

                  MERORS.dialogRegion.show(view);
                });
              });

              contactsListView.on("itemview:contact:delete", function(childView, model){
                model.destroy();
              });

              MERORS.mainRegion.show(contactsListLayout);
            });
          });
        });
      }
    }
  });

  return MERORS.ContactsApp.List.Controller;
});
