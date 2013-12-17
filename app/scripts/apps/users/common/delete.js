'use strict';
define(['app', 'tpl!apps/users/common/templates/delete.tpl', 'backbone.syphon'],
    function(MERORS, deleteTpl) {
        MERORS.module('UsersApp.Common.Views', function(Views, MERORS, Backbone, Marionette, $, _) {
            Views.Form = Marionette.ItemView.extend({
                template: deleteTpl,

                events: {
                    'click button.js-delete': 'deleteClicked',
                    'click button.js-cancelDelete': 'cancelClicked'
                },

                deleteClicked: function(e) {
                    e.preventDefault();
                    var data = Backbone.Syphon.serialize(this);
                    this.trigger('user : delete', data);
                },

                cancelClicked: function() {
                    this.trigger('dialog:close');
                },
            });
        });

        return MERORS.UsersApp.Common.Views;
    }
);