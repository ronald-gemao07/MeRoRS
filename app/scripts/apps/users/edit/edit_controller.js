define(["app", "apps/users/edit/edit_view"], function(MERORS, View){
  MERORS.module("UsersApp.Edit", function(Edit, MERORS, Backbone, Marionette, $, _){
    Edit.Controller = {
      editUser: function(id){
        require(["common/views", "entities/user"], function(CommonViews){
          var loadingView = new CommonViews.Loading({
            title: "Please wait...",
            message: "Loading data..."
          });
          MERORS.mainRegion.show(loadingView);

          var fetchingUser = MERORS.request("user:entity", id);
          
          $.when(fetchingUser).done(function(user){
            var view;
            if(user !== undefined){
              view = new View.User({
                model: user,
                generateTitle: true
              });

              view.on("form:submit", function(data){
                if(user.save(data)){
                  MERORS.trigger("user:show", user.get('id'));
                }
                else{
                  view.triggerMethod("form:data:invalid", user.validationError);
                }
              });
            }
            else{
              view = new MERORS.UsersApp.Show.MissingUser();
            }

            MERORS.mainRegion.show(view);
          });
        });
      }
    };
  });

  return MERORS.UsersApp.Edit.Controller;
});
