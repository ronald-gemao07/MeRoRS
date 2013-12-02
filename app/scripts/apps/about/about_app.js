define(["app", "marionette"], function(MERORS, Marionette){
  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      "about" : "showAbout"
    }
  });

  var API = {
    showAbout: function(){
      require(["apps/about/show/show_controller"], function(ShowController){
        MERORS.startSubApp(null);
        ShowController.showAbout();
        MERORS.execute("set:active:header", "about");
      });
    }
  };

  MERORS.on("about:show", function(){
    $(document).attr("title", "About - Global Zeal Meeting Room Reservation System");
    MERORS.navigate("about");
    API.showAbout();
  });

  MERORS.addInitializer(function(){
    new Router({
      controller: API
    });
  });

  return Router;
});
