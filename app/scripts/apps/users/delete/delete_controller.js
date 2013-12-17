'use strict';
define(["app", "apps/user/delete/delete_view"], function(MERORS, View){
  MERORS.module("UsersApp.Delete", function(Delete, MERORS, Backbone, Marionette, $, _){
    Delete.Controller = {
      deleteUser: function(id){
        require(["common/delete", "entities/user"], function(CommonViews){
          var loadingView = new CommonViews.Loading({
            title: "Artificial Loading Delay",
            message: "Data loading is delayed to demonstrate using a loading view."
          });
          MERORS.mainRegion.show(loadingView);

          var fetchingUser = MERORS.request("user : entity", id);
          $.when(fetchingUser).done(function(user){
            var view;
            if(user !== undefined){
              view = new View.User({
                model: user,
                generateTitle: true
              });
            }

            MERORS.mainRegion.show(view);
          });
        });
      }
    };
  });
  return MERORS.UsersApp.Delete.Controller;
});