'use strict';
define(['app',
        'tpl!apps/users/show/templates/missing.tpl',
        'tpl!apps/users/show/templates/view.tpl'],
       function(MERORS, missingTpl, viewTpl){
  MERORS.module('UsersApp.Show.View', function(View, MERORS, Backbone, Marionette, $, _){
    View.MissingUser = Marionette.ItemView.extend({
      template: missingTpl
    });

    View.User = Marionette.ItemView.extend({
      template: viewTpl,

      events: {
        'click a.js-edit': 'editClicked'
      },

      editClicked: function(e){
        e.preventDefault();
        this.trigger('user:edit', this.model);
      }
    });
  });

  return MERORS.UsersApp.Show.View;
});