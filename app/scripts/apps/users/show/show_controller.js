define(["app", "apps/users/show/show_view"], function(MERORS, View){
  MERORS.module("UsersApp.Show", function(Show, MERORS, Backbone, Marionette, $, _){
    Show.Controller = {
      showUser: function(id){
        require(["common/views", "entities/user"], function(CommonViews){
          var loadingView = new CommonViews.Loading({
            title: "Please wait...",
            message: "Loading data..."
          });
          MERORS.mainRegion.show(loadingView);

          var fetchingUser = MERORS.request("user:entity", id);
          $.when(fetchingUser).done(function(user){
            var userView;
            if(user !== undefined){
              userView = new View.User({
                model: user
              });

              userView.on("user:edit", function(user){
                MERORS.trigger("user:edit", user.get("_id"));
              });
            }
            else{
              userView = new View.MissingUser();
            }

            MERORS.mainRegion.show(userView);
          });
        });
      }
    }
  });

  return MERORS.UsersApp.Show.Controller;
});
