define(["app", "marionette"], function(MERORS, Marionette){
  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      "board" : "showBoard"
    }
  });

  var API = {
    showBoard: function(){
      require(["apps/board/show/show_controller"], function(ShowController){
        $(document).attr("title", "Reservation Board - Global Zeal Meeting Room Reservation System");
        MERORS.startSubApp(null);
        ShowController.showBoard();
        MERORS.execute("set:active:header", "board");
      });
    }
  };

  MERORS.on("board:show", function(){
    MERORS.navigate("board");
    API.showBoard();
  });

  MERORS.addInitializer(function(){
    new Router({
      controller: API
    });
  });

  return Router;
});