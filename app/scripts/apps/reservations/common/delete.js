'use strict';

define(['app', 'tpl!apps/reservations/common/templates/delete.tpl', 'backbone.syphon'],
       function(MERORS, deleteTpl){
  MERORS.module('ReservationsApp.Common.Views', function(Views, MERORS, Backbone, Marionette){
    Views.Form = Marionette.ItemView.extend({
      template: deleteTpl,

      events: {
        'click button.js-delete': 'deleteClicked',
        'click button.js-cancelDelete' : 'cancelClicked'
      },

      deleteClicked: function(e){
        e.preventDefault();
        var data = Backbone.Syphon.serialize(this);
        this.trigger('reservation : delete', data);
      },

      cancelClicked: function(){
        this.trigger('dialog:close');
      },
    });
  });

  return MERORS.ReservationsApp.Common.Views;
});
