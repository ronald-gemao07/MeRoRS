'use strict';
define(['app', 'apps/users/list/list_view'], function(MERORS, View){
  MERORS.module('UsersApp.List', function(List, MERORS, Backbone, Marionette, $, _){
    List.Controller = {
      listUsers: function(criterion){
        require(['common/views', 'entities/user'], function(CommonViews){
          var loadingView = new CommonViews.Loading();
          MERORS.mainRegion.show(loadingView);

          var fetchingUsers = MERORS.request('user:entities');

          var usersListLayout = new View.Layout();
          var usersListPanel = new View.Panel();

          require(['entities/common'], function(FilteredCollection){
            $.when(fetchingUsers).done(function(users){
              var filteredUsers = MERORS.Entities.FilteredCollection({
                collection: users,
                filterFunction: function(filterCriterion){
                  var criterion = filterCriterion.toLowerCase();
                  return function(user){
                    if(user.get('firstName').toLowerCase().indexOf(criterion) !== -1 || user.get('lastName').toLowerCase().indexOf(criterion) !== -1 || user.get('email').toLowerCase().indexOf(criterion) !== -1 || user.get('position').toLowerCase().indexOf(criterion) !== -1){
                        return user;
                    }
                  };
                }
              });

              if(criterion){
                filteredUsers.filter(criterion);
                usersListPanel.once('show', function(){
                  usersListPanel.triggerMethod('set:filter:criterion', criterion);
                });
              }

              var usersListView = new View.Users({
                collection: filteredUsers
              });

              usersListPanel.on('users:filter', function(filterCriterion){
                filteredUsers.filter(filterCriterion);
                MERORS.trigger('users:filter', filterCriterion);
              });

              usersListLayout.on('show', function(){
                usersListLayout.panelRegion.show(usersListPanel);
                usersListLayout.usersRegion.show(usersListView);
              });

              usersListPanel.on('user:new', function(){
                require(['apps/users/new/new_view'], function(NewView){
                  var newUser = MERORS.request('user:entity:new');

                  var view = new NewView.User({
                    model: newUser
                  });

                  view.on('form:submit', function(data){
                    // var highestId = users.max(function(c){ return c.id; }).get('id');
                    // data.id = highestId + 1;
                    console.log(data);
                    if(newUser.save(data)){
                      users.add(newUser);
                      view.trigger('dialog:close');
                      var newUserView = usersListView.children.findByModel(newUser);
                      // check whether the new User view is displayed (it could be
                      // invisible due to the current filter criterion)
                      if(newUserView){
                        newUserView.flash('success');
                      }
                    }
                    else{
                      view.triggerMethod('form:data:invalid', newUser.validationError);
                    }
                  });

                  MERORS.dialogRegion.show(view);
                });
              });

              usersListView.on('itemview:user:show', function(childView, model){
                MERORS.trigger('user:show', model.get('_id'));
              });

              usersListView.on('itemview:user:edit', function(childView, model){
                require(['apps/users/edit/edit_view'], function(EditView){
                  var view = new EditView.User({
                    model: model
                  });

                  view.on('form:submit', function(data){
                    if(model.save(data)){
                      childView.render();
                      view.trigger('dialog:close');
                      childView.flash('success');
                    }
                    else{
                      view.triggerMethod('form:data:invalid', model.validationError);
                    }
                  });

                  MERORS.dialogRegion.show(view);
                });
              });

              usersListView.on('itemview:user:delete', function(childView, model){
                model.destroy();
              });

              MERORS.mainRegion.show(usersListLayout);
            });
          });
        });
      }
    };
  });

  return MERORS.UsersApp.List.Controller;
});