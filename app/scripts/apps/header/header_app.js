'use strict';
define(['app', 'apps/header/list/list_controller'], function(MERORS, ListController){
  MERORS.module('HeaderApp', function(Header, MERORS, Backbone, Marionette, $, _){
    var API = {
      listHeader: function(){
        ListController.listHeader();
      }
    };

    MERORS.commands.setHandler('set:active:header', function(name){
      ListController.setActiveHeader(name);
    });

    Header.on('start', function(){
      require(['common/views', 'entities/profile'], function(CommonViews) {
          var loadingView = new CommonViews.Loading({
              title: 'Loading',
              message: 'Loading required data...'
          });
          MERORS.mainRegion.show(loadingView);
          
          // Load the logged in user profile
          var fetchingProfile = MERORS.request('profile:entities');

          $.when(fetchingProfile).done(function(profiles) {
            // Load the header
            API.listHeader();

          });
      });
     
    });
  });

  return MERORS.HeaderApp;
});