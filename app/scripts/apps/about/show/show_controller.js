'use strict';
define(['app', 'apps/about/show/show_view'], function(MERORS, View){
  return {
    showAbout: function(){
      var view = new View.Message();
      MERORS.mainRegion.show(view);
    }
  };
});