define(["app", "apps/header/list/list_controller"], function(MERORS, ListController){
  MERORS.module("HeaderApp", function(Header, MERORS, Backbone, Marionette, $, _){
    var API = {
      listHeader: function(){
        ListController.listHeader();
      }
    };

    MERORS.commands.setHandler("set:active:header", function(name){
      ListController.setActiveHeader(name);
    });

    Header.on("start", function(){
      API.listHeader();
    });
  });

  return MERORS.HeaderApp;
});
