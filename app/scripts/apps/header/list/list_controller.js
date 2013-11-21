define(["app", "apps/header/list/list_view"], function(MERORS, View){
  MERORS.module("HeaderApp.List", function(List, MERORS, Backbone, Marionette, $, _){
    List.Controller = {
      listHeader: function(){
        require(["entities/header"], function(){
          var links = MERORS.request("header:entities");
          var headers = new View.Headers({collection: links});

          headers.on("brand:clicked", function(){
            MERORS.trigger("about:show");
          });

          headers.on("itemview:navigate", function(childView, model){
            console.log(arguments)
            var trigger = model.get("navigationTrigger");
            console.log(trigger)
            MERORS.trigger(trigger);
          });

          MERORS.headerRegion.show(headers);
        });
      },

      setActiveHeader: function(headerUrl){
        var links = MERORS.request("header:entities");
        var headerToSelect = links.find(function(header){ return header.get("url") === headerUrl; });
        headerToSelect.select();
        links.trigger("reset");
      }
    };
  });

  return MERORS.HeaderApp.List.Controller;
});
