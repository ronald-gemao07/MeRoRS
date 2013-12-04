define(["app", "apps/board/show/show_view", "fullcalendar"], function(MERORS, View, fullcalendar){
  return {
    showBoard: function(){
      var view = new View.Message();
      MERORS.mainRegion.show(view);
    }
  };
});
