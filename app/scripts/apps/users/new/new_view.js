'use strict';
define(['app', 'apps/users/common/views'], function(MERORS, CommonViews){
  MERORS.module('UsersApp.New.View', function(View, MERORS, Backbone, Marionette, $, _){
    View.User = CommonViews.Form.extend({
      title: 'New User',

      onRender: function(){
        this.$('.js-submit').text('Create user');
      }
    });
  });

  return MERORS.UsersApp.New.View;
});