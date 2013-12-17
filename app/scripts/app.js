'use strict';
define(['marionette', 'apps/config/marionette/regions/dialog'], function(Marionette){
  var MERORS = new Marionette.Application();

  MERORS.addRegions({
    headerRegion: '#header-region',
    mainRegion: '#main-region',
    dialogRegion: Marionette.Region.Dialog.extend({
      el: '#dialog-region'
    })
  });

  MERORS.navigate = function(route,  options){
    options || (options = {});
    Backbone.history.navigate(route, options);
  };

  MERORS.getCurrentRoute = function(){
    return Backbone.history.fragment;
  };

  MERORS.startSubApp = function(appName, args){
    var currentApp = appName ? MERORS.module(appName) : null;
    if (MERORS.currentApp === currentApp){ return; }

    if (MERORS.currentApp){
      MERORS.currentApp.stop();
    }

    MERORS.currentApp = currentApp;
    if(currentApp){
      currentApp.start(args);
    }
  };

  MERORS.on('initialize:after', function(){
    if(Backbone.history){
      require(['apps/reservations/reservations_app', 'apps/board/board_app', 'apps/rooms/rooms_app',  'apps/users/users_app', 'apps/about/about_app'], function () {
        Backbone.history.start();

        if(MERORS.getCurrentRoute() === ''){
          MERORS.trigger('board:show');
        }
      });
    }
  });

  return MERORS;
});